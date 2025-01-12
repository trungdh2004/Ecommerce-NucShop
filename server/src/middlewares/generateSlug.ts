import crypto from "crypto";
import slugify from "slugify";

export const generateSlugs = (value: string) => {
  const slug = `${slugify(value, {
    lower: true,
    replacement: "-",
    locale: "vn",
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  })}-${crypto.randomBytes(5).toString("hex")}`;

  return slug;
};

export const generateOrderCode = () => {
  return `${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const generateVoucherCode = () => {
  return `KM${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

// const slug = `${slugify(value, {
//   lower: true,
//   replacement: "-",
//   locale: "vn",
//   trim: true,
//   remove: /[*+~.()'"!:@]/g,
// })}-${Math.random().toString(36).substring(2, 9)}-${crypto
//   .randomBytes(10)
//   .toString("hex")}`;
