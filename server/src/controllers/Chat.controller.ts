import { Response } from "express";
import { RequestModel } from "../interface/models";
import ConversationModel from "../models/Conversation.schema";
import MessageModel from "../models/Message.schema";
import STATUS from "../utils/status";
import { formatDataPaging } from "../common/pagingData";
import { aw } from "@upstash/redis/zmscore-d1ec861c";

class ChatController {
  async findOrCreateConversations(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      let existingConversations = await ConversationModel.findOne({
        user: user?.id,
      });

      if (!existingConversations) {
        existingConversations = await ConversationModel.create({
          user: user?.id,
          lastContent: "Xin chào quý khách đến với cửa hàng NUCSHOP",
          lastSender: "ADMIN",
          lastMessage: Date.now(),
          lastRead: ["ADMIN"],
        });

        await MessageModel.create({
          content: "Xin chào quý khách đến với cửa hàng NUCSHOP",
          sender: "ADMIN",
          conversation: existingConversations?._id,
        });
      }

      return res.status(STATUS.OK).json(existingConversations);
    } catch (error) {}
  }

  async pagingMessageConversation(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const { pageIndex, sender } = req.body;
      const beforeQuery = req.query.before;
      let limit = 20;
      let skip = (pageIndex - 1) * limit || 0;
      let queryBefore = {};

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa truyền phòng chat",
        });

      if (beforeQuery) {
        queryBefore = {
          createdAt: {
            $lte: beforeQuery,
          },
        };
      }

      const existingConversation = await ConversationModel.findById(id);

      if (!existingConversation) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có phòng chat này",
        });
      }

      const dataMessage = await MessageModel.find({
        ...queryBefore,
        conversation: existingConversation?._id,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: {
            _id: 1,
            full_name: 1,
            avatarUrl: 1,
            email: 1,
          },
        })
        .skip(skip)
        .limit(limit);

      const countMessage = await MessageModel.countDocuments({
        conversation: existingConversation?._id,
      });

      let countNotRead = 0;

      if (sender === "USER") {
        countNotRead = await MessageModel.countDocuments({
          conversation: existingConversation?._id,
          read: { $not: { $elemMatch: { $eq: "USER" } } },
        });
      }

      let before = null;

      if (dataMessage?.length > 0) {
        before = dataMessage[0].createdAt;
      }
      const result = formatDataPaging({
        limit,
        pageIndex,
        data: dataMessage,
        count: countMessage,
      });

      return res.status(STATUS.OK).json({
        ...result,
        before,
        countNotRead
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error?.message,
      });
    }
  }

  async createMessage(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;
      const { content, sender } = req.body;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa nhập phòng",
        });

      const existingConversation = await ConversationModel.findById(id);

      if (!existingConversation)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có phòng chat",
        });

      const newMessage = await MessageModel.create({
        conversation: existingConversation?._id,
        content,
        sender,
        read: [sender],
        user: sender === "USER" ? user?.id : null,
      });

      const updateConversation = await ConversationModel.findByIdAndUpdate(
        id,
        {
          lastContent: newMessage?.content,
          lastSender: newMessage?.sender,
          lastMessage: newMessage?.createdAt,
          lastRead: [sender],
        },
        { new: true }
      ).populate({
        path: "user",
        select: {
          _id: 1,
          avatarUrl: 1,
          full_name: 1,
          email: 1,
        },
      });

      return res.status(STATUS.OK).json({
        message: "Tạo thành công",
        data: newMessage,
        conversation: updateConversation,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error?.message,
      });
    }
  }

  async pagingConversation(req: RequestModel, res: Response) {
    try {
      const { pageIndex, keyword } = req.body;
      const user = req.user;
      const limit = 10;
      const skip = (pageIndex - 1) * limit || 0;

      const queryKeyword = {};

      const listConversation = await ConversationModel.find({
        user: {
          $ne: user?.id,
        },
      })
        .sort({
          lastMessage: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "user",
          select: {
            _id: 1,
            full_name: 1,
            avatarUrl: 1,
            email: 1,
          },
        });

      const countConversation = await ConversationModel.countDocuments();

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listConversation,
        count: countConversation,
      });

      return res.status(STATUS.OK).json({
        ...result,
      });
    } catch (error) {}
  }

  async findConversation(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Chưa chọn id",
        });
      }

      const existingConversations = await ConversationModel.findById(
        id
      ).populate({
        path: "user",
        select: {
          _id: 1,
          full_name: 1,
          avatarUrl: 1,
          email: 1,
        },
      });

      if (!existingConversations) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có phòng chat",
        });
      }

      return res.status(STATUS.OK).json(existingConversations);
    } catch (error) {}
  }

  async readMessageById(req: RequestModel, res: Response) {
    try {
      const {id} = req.params;
      const {sender} = req.body;

      if(!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message:"Bạn chưa truyền id"
        })
      }

      const existingMessage = await MessageModel.findById(id);

      if(!existingMessage) {
        return res.status(STATUS.BAD_REQUEST).json({
          message:"Không có tin nhắm đó"
        })
      }

      const updateRead = await MessageModel.findByIdAndUpdate(id,{
        $addToSet: { read: sender }
      },{new:true})


      return res.status(STATUS.OK).json({
        message:"Cập nhập thành công"
      })
    } catch (error) {
      
    }
  }


  async readMessageMany(req: RequestModel, res: Response) {
    try {
      const {sender} = req.body;
      const {id} = req.params

      if(!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message:"Bạn chưa truyền id"
        })
      }

      const existingMessage = await ConversationModel.findById(id);

      if(!existingMessage) {
        return res.status(STATUS.BAD_REQUEST).json({
          message:"Không có phòng chat đó"
        })
      }

      const updateRead = await MessageModel.updateMany({

      },{
        $addToSet: { read: sender }
      },{new:true})


      return res.status(STATUS.OK).json({
        message:"Cập nhập thành công"
      })
    } catch (error) {
      
    }
  }
}

export default new ChatController();
