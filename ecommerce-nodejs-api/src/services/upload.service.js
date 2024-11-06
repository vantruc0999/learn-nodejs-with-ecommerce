"use strict"

// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { cloudinary } = require("../configs/cloudinary.config")
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.config")
const crypto = require("node:crypto");

const urlImagePublic = "https://d2wlu2hrnytstv.cloudfront.net"
const randomImageName = () => crypto.randomBytes(16).toString('hex')

//1. upload from url image

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://ipwatchdog.com/wp-content/uploads/2018/03/pepe-the-frog-1272162_640.jpg'
        const folderName = 'product/shopId', newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        })

        console.log(result);
        return result
    } catch (error) {
        console.error('Error uploading image: ', error)
    }
}

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/6969'
}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        })

        console.log(result);
        return {
            image_url: result.secure_url,
            shopId: 6969,
            thumb_url: cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error('Error uploading image: ', error)
    }
}

const uploadImageFromLocalFiles = async ({
    files,
    folderName = 'product/6969'
}) => {
    try {
        console.log('files::', files, folderName);

        if (!files.length) return

        const uploadedUrls = []

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })

            uploadedUrls.push({
                image_url: result.secure_url,
                shopId: 6969,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                })
            })
        }

        return uploadedUrls
    } catch (error) {
        console.error('Error uploading image: ', error)
    }
}

const uploadImageFromLocalS3 = async ({
    file
}) => {
    try {
        const imageName = randomImageName()

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)

        console.log('file', file);
        console.log('command', command);

        const signedUrl = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName
        })

        const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });
        console.log(`url::`, url);
        return {
            url: `${urlImagePublic}/${imageName}`,
            result
        }
    } catch (error) {
        console.error('Error uploading image using S3Client: ', error)
    }
}

const uploadImageFromLocalCloudFront = async ({
    file
}) => {
    try {
        const imageName = randomImageName()

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName || 'unknown',
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)

        const url = await getSignedUrl({
            url: `${urlImagePublic}/${imageName}`,
            keyPairId: 'KLRJTKP0V6RDW',
            dateLessThan: new Date(Date.now() + 1000 * 60), //expires in 60 seconds
            privateKey: process.env.AWS_BUCKET_PRIVATE_KEY_ID,
        });

        return {
            url,
            result
        }
    } catch (error) {
        console.error('Error uploading image using S3Client: ', error)
    }
}

// uploadImageFromUrl().catch()
module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
    uploadImageFromLocalS3,
    uploadImageFromLocalCloudFront
}