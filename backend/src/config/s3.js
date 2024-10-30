
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";

// Khởi tạo S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
// console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
// console.log('AWS_REGION:', process.env.AWS_REGION);
// console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME); 

const fileFilter = (req, file, cb) => {
  // Danh sách các loại tệp ảnh hợp lệ
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (validImageTypes.includes(file.mimetype)) {
    cb(null, true); // Chấp nhận tệp
  } else {
    cb(new Error('Only image files are allowed!'), false); // Từ chối tệp
  }
};
// Thiết lập multer để tải lên S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${file.originalname}`; 
      console.log('Uploading file with key:', fileName); 
      cb(null, fileName); 
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = { s3, upload };