// IDataExtractionController.ts
import { MulterRequest } from "../../interfaces/IMulter";
import { Response } from "express";

export interface IDataExtractionController {
  extractAadharController(req: MulterRequest, res: Response): Promise<Response>;
}
