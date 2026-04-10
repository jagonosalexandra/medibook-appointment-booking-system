import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/temp')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({ 
    storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, callback) => {
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
        if (allowed.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error('Only JPEG, JPG, PNG and WEBP formats are allowed!'))
        }
    }
})

export default upload