import express from "express";
// import {app,server} from "./socket/index"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.route";
import STATUS from "./utils/status";
import dbConnect from "./config/db";
import * as cron from "cron";
import rootCron from "./cron/index";
import updateStatusShippedToSuccess from "./cron/job1";
import { createServer } from "http";
import { initSocket } from "./socket";
import LocationModel from "./models/Location.schema";
import compression from "compression"

const job = new cron.CronJob(
  rootCron.jobSchedules.job1,
  updateStatusShippedToSuccess,
  null,
  true,
  rootCron.timezone
);

// Bắt đầu công việc cron
job.start();

dotenv.config();
const app = express();
const server = createServer(app);

// cấu hình req
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(compression({
  level:6
}))
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL!,
      "http://localhost:4000",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
// connect db
dbConnect();

initSocket(server);

app.use("/api/v1", router);

(async () => {
  try {
    const location = await LocationModel.findOne();

    if (!location) {
      await LocationModel.create({
        long: +process.env.LONGSHOP! || 105.62573250208116,
        lat: +process.env.LATSHOP! || 21.045193948892585,
      });
    }
  } catch (error) {}
})();
app.get("/hello",(req,res) => {
  return res.status(200).send("XIn chào")
})
app.use("*", (req, res) => {
  res.status(STATUS.BAD_REQUEST).json({
    message: "Đường dẫn không đúng",
    path: req.baseUrl,
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening listening http://localhost:${process.env.PORT}`);
});
