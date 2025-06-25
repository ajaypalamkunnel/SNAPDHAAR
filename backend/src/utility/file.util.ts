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


export const deleteImage = async(frontImagePath:string,backImagePath:string):Promise<void> =>{

   try {
    await Promise.allSettled([
      fs.unlink(frontImagePath),
      fs.unlink(backImagePath)
    ]);
    
  } catch (error) {
    throw new Error("Error while deleting image")
  }

}