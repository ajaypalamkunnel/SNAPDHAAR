import Tesseract from "tesseract.js";


export const extractTextFromImage = async (image:string):Promise<string>=>{
    const {data} = await Tesseract.recognize(image,'eng',{
        logger:m =>console.log(m)
        
    })

    return data.text
}