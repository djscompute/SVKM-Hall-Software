import { Request, Response } from "express";
import cloudinary from "cloudinary";
import config from "config";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.get<string>("CLOUDINARY_NAME"),
  api_key: config.get<string>("CLOUDINARY_API_KEY"),
  api_secret: config.get<string>("CLOUDINARY_SECRET_KEY")
});

export const uploadImageHandler = async (req: Request, res: Response) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload image directly to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path);

    // Respond with the URL of the uploaded image
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
