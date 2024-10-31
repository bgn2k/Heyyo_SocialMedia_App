import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/**
 * File Storage Setup
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/**
 * Routes with files
 */
app.post('/auth/register', upload.single('picture'), register)
/**
 * Routes
 */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
const PORT = process.env.PORT || 3000;
/**
 * MongoDB Setup
 */
mongoose
.connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`MongoDB Connected.\nServer Started At Port : ${PORT}`));
  })
  .catch((error) => {
    console.log(`${error} - MongoDB Connection Failed `);
  });
