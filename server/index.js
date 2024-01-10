import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";
import { register } from "./controllers/auth.js";

/*CONFIGURATION*/
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE*/
const storage = multer.diskStorage({
    destination: function (req, file, ch) {
        cb(null, "public/assets");
    },
    filename: function (req, file, ch) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);

/*ROUTES*/
// app.use("/auth", authroutes)


// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Active',
        message: 'Server is healthy and running.',
    });
});



// /* MONGOOSE SETUP*/
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URL, {
}).then(c => console.log("Database connected"))
    .catch((error) => console.log("Database connection error: " + error))

app.listen(PORT, () => {
    console.log(`Server is working on port: ${PORT}`);
});
