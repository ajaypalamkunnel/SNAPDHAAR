import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { mkdirSync } from 'fs';
import fs from 'fs'
const UPLOAD_DIR = path.join(__dirname, '../../uploads/aadhaar');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const randomName = crypto.randomBytes(4).toString('hex')
        cb(null, `${file.fieldname}-${Date.now()}-${randomName}${ext}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        1
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})