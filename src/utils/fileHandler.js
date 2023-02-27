import _ from 'lodash'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

export const cloudImageUpload = async (req) => {
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  })
  const options = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
  }

  try {
    if (!req.files) {
      return {
        status: false,
        message: 'No file in request',
      }
    } else {
      let data = []
      let urls = []
      if (Array.isArray(req.files.files)) {
        // multiple file upload
        _.forEach(_.keysIn(req.files.files), async (key) => {
          const result = await cloudinary.uploader.upload(
            req.files.files[key].tempFilePath,
            options,
          )
          console.log(result)
          data.push({
            name: result.public_id,
            path: result.secure_url,
            mimetype: `${result.resource_type}/${result.format}`,
            size: result.bytes,
          })
          urls.push(result.secure_url)
        })
      } else {
        const result = await cloudinary.uploader.upload(
          req.files.files.tempFilePath,
          options,
        )
        data.push({
          name: result.public_id,
          path: result.secure_url,
          mimetype: `${result.resource_type}/${result.format}`,
          size: result.bytes,
        })
        urls.push(result.secure_url)
      }

      return {
        status: true,
        message: 'Upload successful.',
        data: data,
        urls: urls,
      }
    }
  } catch (err) {
    console.log(err)
    return err
  }
}
