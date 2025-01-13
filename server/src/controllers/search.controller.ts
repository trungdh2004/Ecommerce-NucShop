import { Request, Response } from "express";
import ProductModel from "../models/products/Product.schema";
import BlogsModel from "../models/Blogs.schema";
import STATUS from "../utils/status";
import { formatDataPaging } from "../common/pagingData";

class SearchController {
  async searchClient(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword || "";

      let queryKeyword = {};
      let queryKeywordBlog = {};

      if (keyword) {
        queryKeywordBlog = {
          title: {
            $regex: keyword,
            $options: "i",
          },
        };
        queryKeyword = {
          name: {
            $regex: keyword,
            $options: "i",
          },
        };
      }

      const listProduct = await ProductModel.find({
        ...queryKeyword,
        is_deleted: false,
      })
        .skip(0)
        .limit(5)
        .select({
          _id: 1,
          slug: 1,
          name: 1,
          price: 1,
          discount: 1,
          thumbnail: 1,
          quantitySold: 1,
          quantity: 1,
          rating: 1,
        });

      const listBlog = await BlogsModel.find({
        ...queryKeywordBlog,
        isPublish: true,
        isDeleted: false,
      })
        .skip(0)
        .limit(5)
        .populate({
          path: "user_id",
          select: {
            _id: 1,
            full_name: 1,
            avatarUrl: 1,
          },
        })
        .select({
          title: 1,
          slug: 1,
          meta_title: 1,
          meta_description: 1,
          thumbnail_url: 1,
          _id: 1,
          views_count: 1,
          countLike: 1,
          published_at: 1,
        });
      return res.status(STATUS.OK).json({
        listProduct: listProduct,
        listBlog: listBlog,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async searchClientDetail(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword || "";
      const type = req.query.type || "product";

      const pageIndex = Number(req.query.pageIndex) || 1;
      const limit = 10;
      let skip = (pageIndex - 1) * limit || 0;
      let query = {};

      if (type === "blog") {
        if (keyword) {
          query = {
            title: {
              $regex: keyword,
              $options: "i",
            },
          };
        }

        const listBlog = await BlogsModel.find({
          ...query,
          isPublish: true,
          isDeleted: false,
        })
          .skip(skip)
          .limit(limit)
          .populate({
            path: "user_id",
            select: {
              _id: 1,
              full_name: 1,
              avatarUrl: 1,
            },
          })
          .select({
            title: 1,
            slug: 1,
            meta_title: 1,
            meta_description: 1,
            thumbnail_url: 1,
            _id: 1,
            views_count: 1,
            countLike: 1,
            published_at: 1,
          });

        const countProduct = await BlogsModel.countDocuments({
          ...query,
          is_delete: false,
          isPublish: true,
        });

        const data = formatDataPaging({
          limit,
          pageIndex,
          data: listBlog,
          count: countProduct,
        });

        return res.status(STATUS.OK).json(data);
      }

      if (keyword) {
        query = {
          name: {
            $regex: keyword,
            $options: "i",
          },
        };
      }

      const listProduct = await ProductModel.find({
        ...query,
        is_deleted: false,
      })
        .skip(skip)
        .limit(limit)
        .select({
          _id: 1,
          slug: 1,
          name: 1,
          price: 1,
          discount: 1,
          thumbnail: 1,
          quantitySold: 1,
          quantity: 1,
          rating: 1,
          images: 1,
        });
      const countProduct = await ProductModel.countDocuments({
        ...query,
        is_deleted: false,
      });

      const data = formatDataPaging({
        limit,
        pageIndex,
        data: listProduct,
        count: countProduct,
      });

      return res.status(STATUS.OK).json(data);
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async contactForm(req: Request, res: Response) {
    try {
      const { name, email, content } = req.body;

      if (!name || !email || !content) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn truyền thiếu dữ liệu",
        });
      }

      const formData = new URLSearchParams({
        "entry.1499165544": name, // Thay bằng entry ID thực tế
        "entry.1584898917": email,
        "entry.1002049118": content,
      });

      await fetch(
        `https://docs.google.com/forms/u/0/d/e/1FAIpQLSej6HJ20CXKB2_sD7wAOI5_k5HC0artC6re2CKaq9Od4sJ4hw/formResponse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      return res.status(STATUS.OK).json({
        message: "Gửi thành công",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new SearchController();
