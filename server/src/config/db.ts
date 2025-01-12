import mongoose from "mongoose";

const dbConnect = () => {
  mongoose
    .connect(`${process.env.DB_URL!}/shopApp`)
    .then(() => {
      console.log("Connect succeeded");
    })
    .catch(() => {
      console.log("Failed to connect");
    });
};

export default dbConnect;
