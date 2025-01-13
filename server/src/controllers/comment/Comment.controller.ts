import { Request, Response } from "express";
import STATUS from "../../utils/status";
import ProductModel from "../../models/products/Product.schema";
import { RequestModel } from "../../interface/models";
import CommentModel from "../../models/comment/comment.model";
import { formatDataPaging } from "../../common/pagingData";
import TYPE_COMMENT from "../../config/typeComment";
import BlogsModel from "../../models/Blogs.schema";

class CommentController {
  async createComment(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { content, commentId, commentType, parent_id } = req.body;

      if (!content || !commentId || !commentType) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn truyền thiếu dữ liệu",
        });
      }

      const valuesType = Object.values(TYPE_COMMENT);

      if (!valuesType.includes(commentType.toString())) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn truyền kiểu bình luận sai",
        });
      }

      if (commentType === TYPE_COMMENT.COMMENT) {
        const existingComment = await CommentModel.findById(commentId);

        if (!existingComment) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có bình luận nào",
          });
        }

        if (parent_id) {
          await BlogsModel.findByIdAndUpdate(parent_id, {
            $inc: {
              comments_count: 1,
            },
          });
        }

        await CommentModel.findByIdAndUpdate(existingComment._id, {
          $inc: {
            replies_count: +1,
          },
        });
      }
      if (commentType === TYPE_COMMENT.PRODUCT) {
        const existingComment = await ProductModel.findById(commentId);

        if (!existingComment) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có sản phẩm nào",
          });
        }
      }
      if (commentType === TYPE_COMMENT.BLOGS) {
        const existingComment = await BlogsModel.findById(commentId);

        await BlogsModel.findByIdAndUpdate(existingComment?._id, {
          $inc: {
            comments_count: 1,
          },
        });

        if (!existingComment) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Không có bài viết nào",
          });
        }
      }

      const newComment = await CommentModel.create({
        user: user?.id,
        content,
        commentType,
        comment_id: commentId,
        parent_id
      });

      const commentRes = await CommentModel.findById(newComment?._id).populate({
        path: "user",
        select: {
          _id: 1,
          full_name: 1,
          avatarUrl: 1,
          is_admin: 1,
          is_staff: 1,
        },
      });

      return res.status(STATUS.OK).json({
        message: "Tạo comment thành công",
        data: commentRes,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getListComments(req: Request, res: Response) {
    try {
      const {
        commentId,
        commentType,
        pageIndex,
        pageSize,
        sort = -1,
      } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      if (!commentId && !commentType) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền giá trị",
        });
      }

      const listComment = await CommentModel.find({
        commentType,
        comment_id: commentId,
        is_removed: false,
      })
        .populate({
          path: "user",
          select: {
            _id: 1,
            full_name: 1,
            avatarUrl: 1,
            is_admin: 1,
            is_staff: 1,
          },
        })
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit);

      const countComment = await CommentModel.countDocuments({
        commentType,
        comment_id: commentId,
        is_removed: false,
      });

      const result = formatDataPaging({
        limit,
        pageIndex,
        data: listComment,
        count: countComment,
      });

      return res.status(STATUS.OK).json(result);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async reactionsComment(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const { is_reacted } = req.body;
      const user = req.user;

      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn bình luận",
        });
      }

      const existingComment = await CommentModel.findById(id);

      if (!existingComment) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có bình luận nào",
        });
      }

      let queryMongoose = {};

      const check = existingComment.reactions.find(
        (comment) => comment.toString() === user?.id.toString()
      );
      if (is_reacted) {
        if (check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Bạn đã thích bình luận",
          });
        }
        queryMongoose = {
          $addToSet: {
            reactions: user?.id,
          },
          $inc: { reactions_count: 1 },
        };
      } else {
        if (!check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Bạn chưa thích bình luận",
          });
        }
        queryMongoose = {
          $pull: {
            reactions: user?.id,
          },
          $inc: { reactions_count: -1 },
        };
      }

      const newComment = await CommentModel.findByIdAndUpdate(
        id,
        {
          ...queryMongoose,
        },
        { new: true }
      ).populate({
        path:"user",
        select:{
          _id:1,
          full_name:1,
          email:1,
          avatarUrl:1
        }
      });

      return res.status(STATUS.OK).json(newComment);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteComment(req: RequestModel, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn bình luận",
        });

      const existingComment = await CommentModel.findById(id);

      if (!existingComment)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có bình luận nào",
        });

      if (existingComment.user.toString() !== user?.id.toString()) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn không có quyền xóa",
        });
      }

      if (existingComment.commentType === TYPE_COMMENT.COMMENT) {
        await CommentModel.findByIdAndUpdate(existingComment.comment_id, {
          $inc: {
            replies_count: -1,
          },
        });
      }

      await CommentModel.findByIdAndUpdate(id, {
        is_removed: true,
      });

      return res.status(STATUS.OK).json({
        message: "Xóa thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new CommentController();
