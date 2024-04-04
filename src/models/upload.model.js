const { cloudinary } = require("../utils/constants");

class UploadService {
  static upload(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file.path, {
        upload_preset: 'image_upload',
      })
      .then((res) => resolve(res.url))
      .catch((err) => reject(err));
    });
  }

  static uploadMultiple(files) {
    return Promise.all(
      files.map((file) => this.upload(file))
    );
  }

  static async uploadMultipleVideo(files) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided.");
    }
    
    const uploadPromises = files.map(async (file) => {
      try {
        const res = await cloudinary.uploader.upload(file.path, {
          upload_preset: 'video_upload',
          resource_type: 'video',
        });
        return {
          url: res.url,
          duration: res.duration,
        };
      } catch (err) {
        throw err;
      }
    });
  
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UploadService;
