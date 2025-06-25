import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'


export const renameImageWithName = async (filePath: string, name: string): Promise<string> => {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const random = crypto.randomBytes(2).toString('hex');
    const sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const newFileName = `${sanitized}_${random}${ext}`;
    const newPath = path.join(dir, newFileName);
    await fs.rename(filePath, newPath);
    return newFileName;
}