// DataExtractionController.ts
import { MulterRequest } from "../../interfaces/IMulter";
import { IDataExtractionController } from "../interface/IDataExtractionController";
import { IDataExtractionService } from "../../service/interface/IDataExtractionService";
import { Response } from "express";
import { StatusCode } from "../../constants/statusCode";

export class DataExtractionController implements IDataExtractionController {
  private _dataExtractionService: IDataExtractionService;

  constructor(dataExtractionService: IDataExtractionService) {
    this._dataExtractionService = dataExtractionService;
  }

  async extractAadharController(req: MulterRequest, res: Response): Promise<Response> {
    try {
     

       const frontImage = req.files?.front?.[0];
    const backImage = req.files?.back?.[0];

      if (!frontImage || !backImage) {
        return res.status(StatusCode.BAD_REQUEST).json({ message: "Both front and back images are required." });
      }

      const result = await this._dataExtractionService.extractAadhaarData(
        frontImage.path,
        backImage.path
      );

      return res.status(StatusCode.OK).json({ success: true, data: result });
    } catch (error: any) {
      console.error("Error in controller:", error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
