const cloudinary = require("../config/cloudinary");

// Uploads an in-memory file buffer to Cloudinary and returns its public URL.
const uploadToCloudinary = (fileBuffer, folder = "devorbit") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;