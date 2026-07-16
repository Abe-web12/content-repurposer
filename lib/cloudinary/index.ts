import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export { cloudinary }

export function uploadBuffer(
  buffer: Buffer,
  options: {
    folder?: string
    publicId?: string
  } = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder ?? "repurposeai",
        public_id: options.publicId,
        resource_type: "image",
        transformation: { quality: "auto", fetch_format: "auto" },
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message))
          return
        }
        resolve(result!.secure_url)
      }
    )

    uploadStream.end(buffer)
  })
}
