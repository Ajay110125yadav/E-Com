import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: "dk6to6b1d",
  api_key: "514272215683856",
  api_secret: "IWV85VGoL62-CHiKJTxYZRmrsJs",
  secure: true
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "ecommerce_products",
      upload_preset: "ecommerce_products" // must be unsigned
    });

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (err) {
    console.log("Cloudinary Error:", err);
    res.status(500).json({
      success: false,
      message: "Cloudinary upload failed",
      error: err.message
    });
  }
};
