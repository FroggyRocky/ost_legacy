require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const S3 = require('aws-sdk/clients/s3');

const bucketParams = { Bucket: process.env.BUCKET_NAME} // <--- заменить
const uploadParams = { Bucket: bucketParams.Bucket, Key: '', Body: '' }
const metaParams = { Bucket: bucketParams.Bucket, Key: '073af81d-ddc7-4a95-a149-f94e885b7bd3.png' }



const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY, 
  secretAccessKey: process.env.AWS_SECRET_KEY, 
  endpoint: 'https://s3.timeweb.com',
  s3ForcePathStyle: true,
  region: process.env.AWS_REGION,
  apiVersion: 'latest',
  ContentEncoding:'base64',
  ContentType:'image/*'
})



exports.uploadS3File = async (req,res) => {
const file = req.files.file
const fileName = uuidv4() + "." + file.mimetype.split('/')[1].replace(/\s/g, '')
  try {
uploadParams.Body = file.data
uploadParams.Key = fileName
    const response = await s3.upload(uploadParams).promise()
    res.status(200).send({location:response.Location, fileName:file.name.replace(/\s/g, '')})
  } catch (e) {
    console.log('Error', e)
    res.sendStatus(500)
  }
 }


// const readFile = async (req,res) => {
//  try {
//   console.log('Чтение файла')
//   const fs = require('fs');
//   const res = await s3.getObject(metaParams).promise()
//   await fs.writeFileSync('./upload' + metaParams.Key, res.Body);
//   console.log('Success', res)
// } catch (e) {
//   console.log('Error', e)
// }

// }

// readFile();