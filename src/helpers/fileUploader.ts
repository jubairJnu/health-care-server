import multer from "multer";
import path from "path";
import fs from "fs";

import { v2 as cloudinary } from "cloudinary";
import config from "../app/config";

type TCloudinaryRes = {
  secure_url: string;
};

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_secret,
});

// Upload an image

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//   crop: "auto",
//   gravity: "auto",
//   width: 500,
//   height: 500,
// });

// console.log(autoCropUrl);/Users/jubair/practice/postgresql/ph-health-care-server/uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// console.log(path.join(process.cwd(), "uploads"));

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: any
): Promise<TCloudinaryRes | undefined> => {
  return new Promise((resole, reject) => {
    cloudinary.uploader
      .upload(`${file?.path}`, {
        public_id: `${file.originalname}`,
      })

      .then((result) => resole(result))
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        fs.unlinkSync(file.path);
      });
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
