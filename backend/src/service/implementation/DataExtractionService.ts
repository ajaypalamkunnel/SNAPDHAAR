import { IDataExtractionService } from "../interface/IDataExtractionService";
import { IAadhaarData } from "../../interfaces/IAadhaarData";
import { extractTextFromImage } from "../../utility/tesseract.util";
import { deleteImage, renameImageWithName } from "../../utility/file.util";
import Tesseract from "tesseract.js";
import fs from "fs";
import { extractAadhaarNumber, extractAddress, extractDOB, extractGender, extractName, extractPincode } from "../../utility/ocrExtractors";
export class DataExtractionService implements IDataExtractionService {
    async extractAadhaarData(
        frontImagePath: string,
        backImagePath: string
    ): Promise<IAadhaarData> {
        let worker: Tesseract.Worker | null = null;
        try {
            if (!fs.existsSync(frontImagePath)) {
                throw new Error(`Front image not found: ${frontImagePath}`);
            }

            if (!fs.existsSync(backImagePath)) {
                throw new Error(`Back image not found: ${backImagePath}`);
            }

            worker = await Tesseract.createWorker();

            // await worker.load();

            await worker.setParameters({
                tessedit_char_whitelist:
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:/()-",
                tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                preserve_interword_spaces: "1",
            });

            const frontResult = await worker.recognize(frontImagePath);
            const backResult = await worker.recognize(backImagePath);

            const frontText = frontResult.data.text;
            const backText = backResult.data.text;
            const combinedText = frontText + '\n' + backText;

            const name = extractName(frontText) || extractName(backText);
            const aadhaarNumber = extractAadhaarNumber(combinedText);
            const dob = extractDOB(combinedText);
            const address = extractAddress(backText) || extractAddress(frontText);
            const gender = extractGender(combinedText);
            const pincode = extractPincode(combinedText);

            
            await deleteImage(frontImagePath,backImagePath)


            return {
                name: name || 'Not found',
                aadhaarNumber: aadhaarNumber || 'Not found',
                dob: dob || 'Not found',
                address: address || 'Not found',
                gender: gender || 'Not found',
                pincode: pincode || 'Not found',
            };
        } catch (error) {
            throw new Error("Data extraction error");
        }
    }
}
