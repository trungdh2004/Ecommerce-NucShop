import { Request, Response } from "express";
import XLSX from "xlsx";
import formidable, { File } from "formidable";
import ProductModel from "../../models/products/Product.schema";
import AttributeModel from "../../models/products/Attribute.schema";
import STATUS from "../../utils/status";
import { ListColor } from "../../interface/cart";
import { IAttribute, IAttributeV2, ICategory, IColor, ISize } from "../../interface/product";
import ColorModel from "../../models/products/Color.schema";
import SizeModel from "../../models/products/Size.schema";
import CategoryModel from "../../models/products/Category.schema";

interface IProductExcel {
  name: string;
  price: number;
  discount: number;
  description: string;
  thumbnail: string;
  images: { url: string }[];
  slug: string;
  is_simple: boolean;
  is_hot: boolean;
  category: ICategory;
  quantity: number;
  attribute: IAttributeV2[];
  listColor: IColor[];
  listSize: ISize[];
}

class ProductExcelController {
  async exportExcelProduct(req: Request, res: Response) {
    try {

      const data = [
        {
          name: "Áo thun",
          price: 100000,
          quantity: 50,
          listColor: [{ color: "Red" }, { color: "Blue" }, { color: "Green" }],
        },
        {
          name: "Quần jeans",
          price: 200000,
          quantity: 20,
          listColor: [{ color: "Black" }, { color: "Blue" }],
        },
        {
          name: "Mũ",
          price: 50000,
          quantity: 100,
          listColor: [{ color: "Yellow" }],
        },
      ];

      const processedData = data.map((item) => ({
        ...item,
        listColor: JSON.stringify(item.listColor),
      }));

      // Tạo một workbook mới
      const wb = XLSX.utils.book_new();

      // Chuyển đổi dữ liệu thành worksheet
      const ws = XLSX.utils.json_to_sheet(processedData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Chuyển đổi workbook thành một buffer
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      // Thiết lập headers cho response
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=products.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Gửi buffer như là response
      res.send(excelBuffer);
    } catch (error) {}
  }

  async exportExcel(req: Request, res: Response) {
    try {
      const file = req.file;

      if (!file) throw new Error();

      // Đọc file Excel từ buffer
      const workbook = XLSX.read(file.buffer, { type: "buffer" }); // Đọc file từ đường dẫn tạm thời

      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Chuyển đổi sheet sang JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const listData: IProductExcel[] = jsonData?.map((item: any) => {
        return {
          name: item.TEN,
          price: item.GIA,
          discount: item.GIA_GIAM,
          description: item.MO_TA,
          thumbnail: item.ANH_DAI_DIEN,
          images: JSON.parse(item.ANH_KHAC),
          slug: item.SLUG,
          is_simple: item.SAN_PHAM_DON_GIAN,
          is_hot: item.SAN_PHAM_HOT,
          category: JSON.parse(item.DANH_MUC),
          quantity: item.SO_LUONG,
          attribute: JSON.parse(item.BIEN_THE),
          listColor: JSON.parse(item.DANH_SACH_MAU),
          listSize: JSON.parse(item.DANH_SACH_KICH_THUOC),
        };
      });

      const mapColor = new Map();
      const mapSize = new Map();
      const mapCategory = new Map();

      for (let product of listData) {
        if (!mapCategory.get(product.category._id)) {
          const newCategory = await CategoryModel.create({
            name: product.category.name,
            description: product.category.description,
          });
          mapCategory.set(product.category._id, newCategory._id);
        }
        
        for(let color of product.listColor) {
          if(!mapColor.get(color._id)) { 
            const newColor = await ColorModel.create({
              name:color.name,
              code: color.code,
            })

            mapColor.set(color._id, newColor._id);
          }
        }

        for(let size of product.listSize) {
          if(!mapSize.get(size._id)) { 
            const newSize = await SizeModel.create({
              name:size.name,
              fromHeight: size.fromHeight,
              fromWeight: size.fromWeight,
              toHeight: size.toHeight,
              toWeight: size.toWeight
            })

            mapSize.set(size._id, newSize._id);
          }
        }

        const dataNewAttribute = product.attribute.map(attribute => {
          if(!attribute) return

          const color = mapColor.get(attribute.color._id)
          const size = mapSize.get(attribute.size._id)

          return {
            color,
            size,
            price:attribute.price,
            discount:attribute.discount,
            quantity:attribute.quantity
          }
        }) 

        let listId:string[] = []

        if(dataNewAttribute.length > 0) {
          const newAttribute = await AttributeModel.create(dataNewAttribute)

          newAttribute.map(attribute => {
            listId.push(attribute._id)
          })

        }

        await ProductModel.create({
          name: product.name,
          price: product.price,
          discount: product.discount,
          description:product.description,
          quantity: product.quantity,
          thumbnail:product.thumbnail,
          images: product.images,
          is_simple:product.is_simple,
          is_hot:product.is_hot,
          category:mapCategory.get(product.category._id),
          attributes:listId
        })
        
      }
      // Trả về dữ liệu JSON từ file Excel
      return res.json({
        key: Array.from(mapCategory.keys()),
        value: Array.from(mapCategory.values()),
        keyColor: Array.from(mapColor.values()),
        valueColor: Array.from(mapColor.values()),
        keySize: Array.from(mapSize.values()),
        valueSize: Array.from(mapSize.values()),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async pagingProductFile(req: Request, res: Response) {
    try {
      const {
        pageIndex,
        pageSize,
        keyword,
        color = [],
        size = [],
        sort = -1,
        fieldSort,
        category,
        min,
        max,
        tab,
        rating,
        is_simple,
      } = req.body;

      let limit = pageSize || 10;
      let skip = (pageIndex - 1) * limit || 0;
      let queryKeyword = keyword
        ? {
            name: {
              $regex: keyword,
              $options: "i",
            },
          }
        : {};
      let queryAttribute = {};
      let querySort = {};
      let queryCategory = {};
      let queryPrice = {};
      let queryTab = {};
      let queryRating = {};
      let querySimple = {};

      if (tab === 2) {
        queryTab = {
          is_deleted: true,
        };
      } else {
        queryTab = {
          is_deleted: false,
        };
      }

      // attribute
      if (color.length > 0 || size.length > 0) {
        let conditions = {};

        if (color.length > 0 && size.length > 0) {
          conditions = {
            $and: [
              {
                size: {
                  $in: size,
                },
              },
              {
                color: {
                  $in: color,
                },
              },
            ],
          };
        } else if (color.length > 0) {
          conditions = { color: color };
        } else if (size.length > 0) {
          conditions = { size: size };
        }
        const listAttributeColor = await AttributeModel.find(conditions);
        const colorAttributeIds = listAttributeColor?.map((attr) => attr._id);
        queryAttribute = {
          attributes: {
            $in: colorAttributeIds,
          },
        };
      }

      // sắp xếp
      if (fieldSort) {
        querySort = {
          [fieldSort]: sort,
        };
      } else {
        querySort = {
          createdAt: sort,
        };
      }

      if (category) {
        queryCategory = {
          category,
        };
      }

      if (min || max) {
        if (min && max) {
          queryPrice = {
            $and: [
              {
                price: {
                  $lte: max,
                },
              },
              {
                price: {
                  $gte: min,
                },
              },
            ],
          };
        } else if (min) {
          queryPrice = {
            price: {
              $gte: min,
            },
          };
        } else if (max) {
          queryPrice = {
            price: {
              $lte: max,
            },
          };
        }
      }

      if (rating) {
        queryRating = {
          $lte: {
            rating: rating,
          },
        };
      }

      if (is_simple === true) {
        querySimple = {
          is_simple: true,
        };
      }

      const listProduct = await ProductModel.find({
        ...queryKeyword,
        ...queryAttribute,
        ...queryCategory,
        ...queryPrice,
        ...queryTab,
        ...queryRating,
        ...querySimple,
      })
        .sort(querySort)
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "attributes",
            populate: [
              {
                path: "color",
                model: "Color",
              },
              {
                path: "size",
                model: "Size",
              },
            ],
          },
          "category",
        ])
        .lean();

      const newDataExcel = listProduct?.map((product) => {
        if (product.is_simple) {
          return {
            ...product,
            listColor: [],
            listSize: [],
          };
        }

        const listColor = product.attributes?.reduce((acc: IColor[], item) => {
          const itemValue = item as IAttribute;

          let group = acc.find(
            (g) =>
              g._id.toString() ===
              ((itemValue.color as IColor)._id?.toString() as string)
          );
          // Nếu nhóm không tồn tại, tạo nhóm mới
          if (group) {
            return acc;
          }

          // Thêm đối tượng vào nhóm tương ứng

          return [...acc, itemValue.color as IColor];
        }, []);

        const listSize = product.attributes?.reduce((acc: ISize[], item) => {
          const itemValue = item as IAttribute;
          let group = acc.find(
            (g) =>
              g._id.toString() ===
              ((itemValue.size as ISize)._id?.toString() as string)
          );
          // Nếu nhóm không tồn tại, tạo nhóm mới
          if (group) {
            return acc;
          }

          // Thêm đối tượng vào nhóm tương ứng

          return [...acc, itemValue.size as ISize];
        }, []);

        return {
          ...product,
          listColor,
          listSize,
        };
      });

      // Chuyển đổi dữ liệu thành định dạng mảng 2D
      const formattedData = newDataExcel.map((item, index) => {
        const listImg = item.images.map((img) => ({ url: img.url })) || [];
        return {
          STT: index,
          name: item.name,
          price: item.price,
          discount: item.discount,
          description: item.description,
          thumbnail: item.thumbnail,
          images: JSON.stringify(listImg),
          slug: item.slug,
          is_simple: item.is_simple || false,
          is_hot: item.is_hot || false,
          category: JSON.stringify(item.category),
          quantity: item.quantity,
          attribute: JSON.stringify(item.attributes),
          listColor: JSON.stringify(item.listColor),
          listSize: JSON.stringify(item.listSize),
        };
      });

      const wb = XLSX.utils.book_new();

      // Chuyển đổi dữ liệu thành worksheet
      const ws = XLSX.utils.json_to_sheet(formattedData);
      ws["A1"].v = "STT";
      ws["B1"].v = "TEN";
      ws["C1"].v = "GIA";
      ws["D1"].v = "GIA_GIAM";
      ws["E1"].v = "MO_TA";
      ws["F1"].v = "ANH_DAI_DIEN";
      ws["G1"].v = "ANH_KHAC";
      ws["H1"].v = "SLUG";
      ws["I1"].v = "SAN_PHAM_DON_GIAN";
      ws["J1"].v = "SAN_PHAM_HOT";
      ws["K1"].v = "DANH_MUC";
      ws["L1"].v = "SO_LUONG";
      ws["M1"].v = "BIEN_THE";
      ws["N1"].v = "DANH_SACH_MAU";
      ws["O1"].v = "DANH_SACH_KICH_THUOC";
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      // Chuyển đổi workbook thành một buffer
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "buffer",
      });

      // Thiết lập header để trả về file
      res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Trả về file Excel dưới dạng buffer
      res.send(excelBuffer);

      // Gửi buffer như là response
      res.send(excelBuffer);
    } catch (error:any) {
      return res.status(STATUS.INTERNAL).json({
        message: error.message
      })
    }
  }
}

export default new ProductExcelController();
