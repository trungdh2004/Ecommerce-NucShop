import { Response, ErrorRequestHandler } from "express";
import { RequestModel } from "../../interface/models";
import STATUS from "../../utils/status";
import CartModel from "../../models/cart/Cart.schema";
import { cartItemValidation } from "../../validation/cart.validation";
import CartItemModel from "../../models/cart/CartItem.schema";
import { formatDataPaging } from "../../common/pagingData";
import ProductModel from "../../models/products/Product.schema";
import mongoose from "mongoose";
import { IAttribute, IColor, IProduct, ISize } from "../../interface/product";
import AttributeModel from "../../models/products/Attribute.schema";
import {
  IndexCartItem,
  IndexResAcc,
  ListColor,
  ListSize,
  ProductFindCart,
} from "../../interface/cart";
import { accessSync } from "fs";

interface RowIColor {
  colorId: string;
  colorName: string;
  colorCode: string;
  list: IAttribute[];
  quantity: number;
}
interface RowISize {
  sizeId: string;
  sizeName: string;
  list: IAttribute[];
  quantity: number;
}

class CartController {
  async pagingCart(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { pageSize = 10 } = req.body;
      let skip = 0;

      let existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        existingCart = await CartModel.create({
          user: user?.id,
        });
      }

      const listProduct = await CartItemModel.aggregate([
        {
          $match: {
            cart: existingCart?._id,
          },
        },
        {
          $lookup: {
            from: "products", // Tên bộ sưu tập products
            localField: "product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product", // Giải nén mảng productDetails
        },
        {
          $lookup: {
            from: "attributes", // Tên bộ sưu tập products
            localField: "product.attributes",
            foreignField: "_id",
            as: "productAttributes",
          },
        },
        {
          $unwind: {
            path: "$productAttributes",
            preserveNullAndEmptyArrays: true,
          }, // Chuyển đổi mảng customer thành tài liệu riêng lẻ
        },
        {
          $lookup: {
            from: "colors", // Tên bộ sưu tập products
            localField: "productAttributes.color",
            foreignField: "_id",
            as: "productAttributes.color",
          },
        },
        {
          $unwind: "$productAttributes.color",
        },
        {
          $lookup: {
            from: "sizes", // Tên bộ sưu tập products
            localField: "productAttributes.size",
            foreignField: "_id",
            as: "productAttributes.size",
          },
        },
        {
          $unwind: "$productAttributes.size",
        },
        {
          $lookup: {
            from: "attributes", // Tên bộ sưu tập products
            localField: "attribute",
            foreignField: "_id",
            as: "attribute",
          },
        },
        {
          $unwind: {
            path: "$attribute",
            preserveNullAndEmptyArrays: true, // Bảo toàn giá trị null
          },
        },
        {
          $lookup: {
            from: "colors", // Tên bộ sưu tập products
            localField: "attribute.color",
            foreignField: "_id",
            as: "attribute.color",
          },
        },
        {
          $unwind: {
            path: "$attribute.color",
            preserveNullAndEmptyArrays: true, // Bảo toàn giá trị null
          },
        },
        {
          $lookup: {
            from: "sizes", // Tên bộ sưu tập products
            localField: "attribute.size",
            foreignField: "_id",
            as: "attribute.size",
          },
        },
        {
          $unwind: {
            path: "$attribute.size",
            preserveNullAndEmptyArrays: true, // Bảo toàn giá trị null
          },
        },
        {
          $group: {
            _id: "$product",
            createdAt: { $max: "$createdAt" },
            items: {
              $addToSet: {
                quantity: "$quantity",
                createdAt: "$createdAt",
                _id: "$_id",
                price: "$product.price",
                name: "$product.name",
                productId: "$product._id",
                quantitySold: "$product.quantitySold",
                discount: "$product.discount",
                thumbnail: "$product.thumbnail",
                attribute: "$attribute",
              },
            },
            attributes: {
              $addToSet: {
                _id: "$productAttributes._id",
                color: "$productAttributes.color",
                size: "$productAttributes.size",
                quantity: "$productAttributes.quantity",
                discount: "$productAttributes.discount",
                price: "$productAttributes.price",
              },
            },
          },
        },
        {
          $sort: {
            createdAt: -1, // Sắp xếp nhóm theo ID
          },
        },
        {
          $project: {
            _id: 0,
            product: "$_id",
            createdAt: 1,
            items: 1,
            attributes: 1,
          },
        },
        {
          $skip: skip, // Bỏ qua các bản ghi đã được xử lý
        },
        {
          $limit: pageSize, // Giới hạn số lượng bản ghi
        },
      ]);

      const dataList = listProduct?.map((cartItem) => {
        const listColor = (cartItem?.attributes as IAttribute[])?.reduce(
          (acc: RowIColor[], item) => {
            let group = acc.find(
              (g) =>
                g.colorId.toString() ===
                ((item.color as IColor)._id?.toString() as string)
            );
            // Nếu nhóm không tồn tại, tạo nhóm mới
            if (!group) {
              group = {
                colorId: (item.color as IColor)._id as string,
                colorName: (item.color as IColor).name as string,
                list: [item],
                quantity: item.quantity,
                colorCode: (item.color as IColor).code,
              };
              acc.push(group);
              return acc;
            }

            // Thêm đối tượng vào nhóm tương ứng
            group.list.push(item);
            group.quantity = group.quantity + item.quantity;
            return acc;
          },
          []
        );

        const listSize = (cartItem?.attributes as IAttribute[])?.reduce(
          (acc: RowISize[], item) => {
            let group = acc.find(
              (g) =>
                g.sizeId.toString() ===
                ((item.size as ISize)._id?.toString() as string)
            );
            // Nếu nhóm không tồn tại, tạo nhóm mới
            if (!group) {
              group = {
                sizeId: (item.size as ISize)._id as string,
                sizeName: (item.size as ISize).name as string,
                list: [item],
                quantity: item.quantity,
              };
              acc.push(group);
              return acc;
            }

            // Thêm đối tượng vào nhóm tương ứng
            group.list.push(item);
            group.quantity = group.quantity + item.quantity;
            return acc;
          },
          []
        );

        return {
          ...cartItem,
          listColor,
          listSize,
        };
      });

      const countProduct = await CartItemModel.countDocuments({
        cart: existingCart._id,
      });
      const data = formatDataPaging({
        limit: 10,
        pageIndex: 1,
        data: dataList,
        count: countProduct,
      });

      return res.status(STATUS.OK).json({
        message: "Lấy thành công ",
        data: data,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async pagingCartV2(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      let existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Lỗi hệ thống",
        });
      }

      const listCartItem = await CartItemModel.find<IndexCartItem>({
        cart: existingCart?._id,
      })
        .populate([
          {
            path: "product",
            populate: {
              path: "attributes",
              populate: [
                {
                  path: "color",
                },
                {
                  path: "size",
                },
              ],
            },
            select: {
              _id: 1,
              name: 1,
              discount: 1,
              price: 1,
              thumbnail: 1,
              attributes: 1,
              quantity: 1,
              is_hot: 1,
              is_simple: 1,
              createdAt: 1,
              slug: 1,
            },
          },
          {
            path: "attribute",
            // match: { $ne: null },
            populate: [
              {
                path: "color",
              },
              {
                path: "size",
              },
            ],
          },
        ])
        .sort({ createdAt: -1 });

      const listData = listCartItem?.reduce(
        (acc: IndexResAcc[], item: IndexCartItem) => {
          const findCart = acc.find(
            (sub) => sub?.product._id === item.product._id
          );

          if (findCart) {
            const data = {
              quantity: item.quantity,
              _id: item._id,
              thumbnail: item.product.thumbnail,
              name: item.product.name,
              discount: item.product.is_simple
                ? item.product.discount
                : item.attribute?.discount || 0,
              price: item.product.is_simple
                ? item.product.price
                : item.attribute?.price || 0,
              attribute: item.attribute,
              is_simple: item.is_simple,
              createdAt: item.createdAt,
              productId: item.product._id,
              slug: item.product.slug,
              totalQuantity: item.is_simple
                ? item.product.quantity
                : item.attribute?.quantity,
            };
            findCart.items.push(data);
            return acc;
          }

          const listAttribute = item.product.attributes || [];

          let listColor: ListColor[] = [];
          let listSize: ListSize[] = [];

          if (!item?.product?.is_simple) {
            listColor = listAttribute?.reduce((acc: ListColor[], item) => {
              let group = acc.find(
                (g) =>
                  g.colorId.toString() ===
                  ((item.color as IColor)._id?.toString() as string)
              );
              // Nếu nhóm không tồn tại, tạo nhóm mới
              if (!group) {
                group = {
                  colorId: (item.color as IColor)._id as string,
                  colorName: (item.color as IColor).name as string,
                  list: [item],
                  quantity: item.quantity,
                  colorCode: (item.color as IColor).code,
                };
                acc.push(group);
                return acc;
              }

              // Thêm đối tượng vào nhóm tương ứng
              group.list.push(item);
              group.quantity = group.quantity + item.quantity;
              return acc;
            }, []);

            listSize = listAttribute?.reduce((acc: ListSize[], item) => {
              let group = acc.find(
                (g) =>
                  g.sizeId.toString() ===
                  ((item.size as ISize)._id?.toString() as string)
              );
              // Nếu nhóm không tồn tại, tạo nhóm mới
              if (!group) {
                group = {
                  sizeId: (item.size as ISize)._id as string,
                  sizeName: (item.size as ISize).name as string,
                  list: [item],
                  quantity: item.quantity,
                };
                acc.push(group);
                return acc;
              }

              // Thêm đối tượng vào nhóm tương ứng
              group.list.push(item);
              group.quantity = group.quantity + item.quantity;
              return acc;
            }, []);
          }
          const data: IndexResAcc = {
            product: item.product,
            createdAt: item.createdAt,
            attributes: item.product.attributes,
            listColor: listColor,
            listSize: listSize,
            items: [
              {
                quantity: item.quantity,
                _id: item._id,
                thumbnail: item.product.thumbnail,
                name: item.product.name,
                discount: item.product.is_simple
                  ? item.product.discount
                  : item.attribute?.discount || 0,
                price: item.product.is_simple
                  ? item.product.price
                  : item.attribute?.price || 0,
                attribute: item.attribute,
                is_simple: item.is_simple,
                createdAt: item.createdAt,
                productId: item.product._id,
                slug: item.product.slug,
                totalQuantity: item.is_simple
                  ? item.product.quantity
                  : item.attribute?.quantity,
              },
            ],
            is_simple: item.is_simple,
          };
          return [...acc, data];
        },
        []
      );

      return res.status(STATUS.OK).json({
        listData,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async addProductToCart(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const { error } = cartItemValidation.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const { productId, quantity, attribute } = req.body;

      if (!user)
        return res.status(STATUS.AUTHORIZED).json({
          message: "Bạn chưa đăng nhập",
        });

      let existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Lỗi hệ thống",
        });
      }

      const existingProductCart = await CartItemModel.findOne({
        product: productId,
        attribute: attribute,
        cart: existingCart._id,
      });

      if (existingProductCart) {
        const data = await CartItemModel.findByIdAndUpdate(
          existingProductCart?._id,
          {
            quantity: existingProductCart.quantity + +quantity,
          },
          {
            new: true,
            populate: ["product", "attribute"],
          }
        );
        return res.status(STATUS.OK).json({
          message: "Thêm thành công",
          type: "update",
          data,
        });
      }

      const existingProduct = await ProductModel.findById(productId);

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm thỏa mãn",
          toast: true,
        });
      }
      if (existingProduct.is_deleted) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Sản phẩm đã bị xóa",
          toast: true,
        });
      }

      if (existingProduct.quantity < quantity) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Số lượng vượt quá",
          toast: true,
        });
      }

      const newCartItem = await CartItemModel.create({
        product: productId,
        quantity: +quantity,
        attribute,
        cart: existingCart._id,
        is_simple: existingProduct.is_simple,
      });

      if (!newCartItem) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Thêm thất bại",
          type: "add",
        });
      }

      const data = await CartItemModel.findById(newCartItem._id).populate([
        "product",
        "attribute",
      ]);

      return res.status(STATUS.OK).json({
        message: "Thêm thành công",
        data: data,
        type: "add",
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async updateCartItem(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { quantity, attribute } = req.body;
      const { id } = req.params;
      if (!quantity && !attribute) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa truyền giá trị",
        });
      }

      if (!id)
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn",
        });

      const cartUser = await CartModel.findOne({
        user: user?.id,
      });

      const existingCartItem = await CartItemModel.findById(id).populate(
        "attribute product"
      );

      if (!existingCartItem) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có giá trị thỏa mãn",
        });
      }

      let quantityDefauld = quantity || existingCartItem?.quantity;

      if (quantity) {
        if (
          !(existingCartItem?.product as any)?.is_simple &&
          !(existingCartItem?.attribute as IAttribute)?._id
        ) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Sản phẩm không còn loại này",
          });
        }
        if (
          (existingCartItem?.product as any)?.is_simple &&
          quantity > (existingCartItem?.product as any)?.quantity
        ) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: `Chỉ còn ${
              (existingCartItem.attribute as IAttribute).quantity
            } sản phẩm loại hàng này`,
          });
        }
        if (
          !(existingCartItem?.product as any)?.is_simple &&
          quantity > (existingCartItem.attribute as IAttribute)?.quantity
        ) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: `Chỉ còn ${
              (existingCartItem.attribute as IAttribute).quantity
            } sản phẩm loại hàng này`,
          });
        }
      }

      if (attribute) {
        const checkCartItem = await CartItemModel.findOne({
          attribute: attribute,
          cart: cartUser?._id,
        });

        if (checkCartItem) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Loại hàng này đã có ở giỏ hàng",
          });
        }

        const checkAttribute = await AttributeModel.findById(attribute);

        if (!checkAttribute) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Sản phẩm không còn loại hàng này nữa",
          });
        }

        if (checkAttribute.quantity < quantityDefauld) {
          quantityDefauld = checkAttribute.quantity;
        }
      }
      const updatedProduct = await CartItemModel.findByIdAndUpdate(
        id,
        {
          quantity: quantity ? quantity : existingCartItem.quantity,
          attribute: attribute ? attribute : existingCartItem.attribute,
          is_simple: !attribute,
        },
        {
          new: true,
          populate: [
            {
              path: "product",
              select: {
                name: 1,
                _id: 1,
                thumbnail: 1,
                quantitySold: 1,
                price: 1,
                discount: 1,
              },
            },
            {
              path: "attribute",
              populate: [
                {
                  path: "color",
                },
                {
                  path: "size",
                },
              ],
            },
          ],
        }
      ).lean();

      if (!updatedProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Thay đổi thất bại",
        });
      }

      const result = {
        quantity: updatedProduct.quantity,
        createdAt: updatedProduct.createdAt,
        _id: updatedProduct._id,
        price: (updatedProduct.product as IProduct).price,
        name: (updatedProduct.product as IProduct).name,
        productId: (updatedProduct.product as IProduct)._id,
        quantitySold: (updatedProduct.product as IProduct).quantitySold,
        discount: (updatedProduct.product as IProduct).discount,
        thumbnail: (updatedProduct.product as IProduct).thumbnail,
        attribute: updatedProduct.attribute,
      };

      return res.status(STATUS.OK).json({
        message: "Thay đổi thành công",
        data: result,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async deleteCartItem(req: RequestModel, res: Response) {
    try {
      const { listId } = req.body;

      if (!listId) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Bạn chưa chọn giá trị",
        });
      }

      await CartItemModel.deleteMany({
        _id: {
          $in: listId,
        },
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

  async getCountProductCart(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Lỗi hệ thống",
        });
      }

      const countProductCart = await CartItemModel.find({
        cart: existingCart._id,
      });

      if (countProductCart?.length === 0) {
        return res.status(STATUS.OK).json({
          message: "Lấy thành công",
          count: 0,
        });
      }

      const count = countProductCart?.reduce((acc, product) => {
        return acc + product.quantity;
      }, 0);

      return res.status(STATUS.OK).json({
        message: "Lấy thành công",
        count: count || 0,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }

  async getPagingNewCartItem(req: RequestModel, res: Response) {
    try {
      const user = req.user;
      const { pageIndex, pageSize } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;

      let existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Lỗi hệ thống",
        });
      }

      const listCartItem = await CartItemModel.find({
        cart: existingCart._id,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "product",
            select: {
              _id: 1,
              price: 1,
              thumbnail: 1,
              name: 1,
            },
          },
          {
            path: "attribute",
            match: { _id: { $ne: null } }, // Chỉ populate nếu attribute không bị xóa
            populate: [{ path: "color" }, { path: "size" }],
          },
        ]);

      return res.status(STATUS.OK).json({
        message: "Lấy giá trị nè",
        content: listCartItem,
      });
    } catch (error) {}
  }

  async productToOrder(req: RequestModel, res: Response) {
    try {
      const user = req.user;

      const { error } = cartItemValidation.validate(req.body);

      if (error) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const { productId, quantity, attribute } = req.body;

      if (!user)
        return res.status(STATUS.AUTHORIZED).json({
          message: "Bạn chưa đăng nhập",
        });

      let existingCart = await CartModel.findOne({
        user: user?.id,
      });

      if (!existingCart) {
        existingCart = await CartModel.create({
          user: user.id,
        });
      }

      const existingProduct = await ProductModel.findById(productId);

      if (!existingProduct) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Không có sản phẩm thỏa mãn",
          toast: true,
        });
      }
      if (existingProduct.is_deleted) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Sản phẩm đã bị xóa",
          toast: true,
        });
      }

      if (existingProduct.attributes.length > 0 && !existingProduct.is_simple) {
        if (!attribute) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Bạn chưa chọn loại hàng",
            toast: true,
          });
        }

        const check = existingProduct.attributes.find(
          (item) => item.toString() === attribute.toString()
        );

        if (!check) {
          return res.status(STATUS.BAD_REQUEST).json({
            message: "Sản phẩm đã bị thay đổi và không còn loại hàng bạn chọn",
            toast: true,
          });
        }
      }

      if (existingProduct.is_simple && !!attribute) {
        return res.status(STATUS.BAD_REQUEST).json({
          message: "Sản phẩm đã bị thay đổi mời bạn load lại trang web",
          toast: true,
        });
      }

      const existingProductCart = await CartItemModel.deleteMany({
        product: productId,
        attribute: attribute,
        cart: existingCart._id,
      });

      const newCartItem = await CartItemModel.create({
        product: productId,
        quantity: +quantity,
        attribute,
        cart: existingCart._id,
        is_simple: existingProduct.is_simple,
      });

      const stateValue = {
        listId: [newCartItem?._id],
        voucher: null,
      };

      const stateJson = JSON.stringify(stateValue);

      const stateDeCodeUrl = encodeURIComponent(stateJson);

      return res.status(STATUS.OK).json({
        url: stateDeCodeUrl,
      });
    } catch (error: any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message,
      });
    }
  }
}

export default new CartController();
