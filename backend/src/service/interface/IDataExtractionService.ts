import { Request,Response } from "express"
import { IAadhaarData } from "../../interfaces/IAadhaarData"

export interface IDataExtractionService{
    extractAadhaarData( frontPath: string,  backPath: string):Promise<IAadhaarData>
}