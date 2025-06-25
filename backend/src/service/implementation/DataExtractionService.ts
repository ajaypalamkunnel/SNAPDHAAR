import { IDataExtractionService } from "../interface/IDataExtractionService";
import { IAadhaarData } from "../../interfaces/IAadhaarData";
import { extractTextFromImage } from "../../utility/tesseract.util";
import { renameImageWithName } from "../../utility/file.util";
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






            console.log("name==>", name);
            console.log("adahar no==>", aadhaarNumber);
            console.log("address==>", address);
            console.log("dob==>", dob);
            console.log("gender==>", gender);
            console.log("pincode==>", pincode);
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

//  const frontText = await extractTextFromImage(frontPath)
//     const backText = await extractTextFromImage(backPath)

//     console.log("====>",frontText)
//     console.log("====>",backText)

//     const lines = frontText.split('\n').map(l => l.trim()).filter(Boolean);
//     const backLines = backText.split('\n').map(l => l.trim()).filter(Boolean);

//     console.log("========",backLines)
//         // 1. NAME EXTRACTION (Improved)
// let name = 'Unknown';

// // Pattern 1: Look for "NAME / LASTNAME" format
// const nameSlashPattern = lines.find(line => line.match(/^[A-Z][A-Z\s]+\s*\/\s*[A-Z][A-Z\s]+$/i));
// if (nameSlashPattern) {
//     name = nameSlashPattern.split('/')[0].trim();
// }

// // Pattern 2: Look for name before DOB
// if (name === 'Unknown') {
//     const dobMatch = frontText.match(/(\d{2}\/\d{2}\/\d{4})/);
//     if (dobMatch) {
//         const dobLineIndex = lines.findIndex(line => line.includes(dobMatch[0]));
//         if (dobLineIndex > 0) {
//             const candidateLine = lines[dobLineIndex - 1];
//             if (candidateLine.match(/^[A-Z][A-Z\s]+$/)) {
//                 name = candidateLine;
//             }
//         }
//     }
// }

//     const dobMatch = frontText.match(/(\d{2}\/\d{2}\/\d{4})/);
//     const genderMatch = frontText.match(/\b(MALE|FEMALE|TRANSGENDER)\b/i);
//     const aadharMatch = frontText.match(/\d{4}\s\d{4}\s\d{4}/);

//     const dobIndex = lines.findIndex(line => dobMatch && line.includes(dobMatch[0]));
//     if (dobIndex >= 1) {
//         const candidateName = lines[dobIndex - 1];
//         if (/^[A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+$/.test(candidateName)) {
//             name = candidateName;
//         }
//     }

//     let address = 'Unknown';
// const addressStart = backLines.findIndex(line => /Address\s*:/i.test(line));
// if (addressStart !== -1) {
//     // Find where address ends (before XXXX or other markers)
//     let addressEnd = backLines.slice(addressStart + 1).findIndex(line =>
//         line.match(/XXXX|uidai|http|©|year/i)
//     );

//     if (addressEnd === -1) addressEnd = backLines.length;

//     address = backLines
//         .slice(addressStart + 1, addressStart + 1 + addressEnd)
//         .filter(line => line && !line.match(/XXXX|uidai|http|©|year/i))
//         .join(', ');

//     // Clean up common OCR errors
//     address = address
//         .replace(/[^a-zA-Z0-9\s,\-\.]/g, '') // Remove special chars
//         .replace(/\s+/g, ' ') // Collapse multiple spaces
//         .trim();

// }

//     //   const newFilename = await renameImageWithName(frontPath, nameLine?.toString()||"");
