import { Request, Response } from "express";
import cloudinary from "cloudinary";
import config from "config";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.get<string>("CLOUDINARY_NAME"),
  api_key: config.get<string>("CLOUDINARY_API_KEY"),
  api_secret: config.get<string>("CLOUDINARY_SECRET_KEY"),
});

export const uploadImageHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
    const result = await cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Upload to Cloudinary failed" });
        } else {
          res.json({ imageUrl: result?.url });
        }
      }
    );

    // Write the file buffer to the upload stream
    const uploadStream = result.end(req.file.buffer);

    // Respond with the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
