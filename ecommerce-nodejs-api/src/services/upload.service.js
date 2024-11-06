"use strict"

const { cloudinary } = require("../configs/cloudinary.config")

//1. upload from url image

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://scontent.fdad3-6.fna.fbcdn.net/v/t51.75761-15/462946215_18457689166047485_936434770345523651_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHSj6x51CDVEmbinPdrHUjqsuFGzdp0KkKy4UbN2nQqQkxwL3t_UHGK4iks3nTwIMrGqV-V3ggstJaa50TYNRA9&_nc_ohc=zNjNusO2YhIQ7kNvgEv779o&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=AOAmlpBy3u__H_P9nbDS6yd&oh=00_AYBKYC17EiwWjSeRINuWTx9QLGhx67IT7OENiTUB1jliag&oe=67300F31'
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

// uploadImageFromUrl().catch()
module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles
}