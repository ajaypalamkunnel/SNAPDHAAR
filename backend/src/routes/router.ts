// route file
import { Router, Request, Response } from "express";
import { DataExtractionService } from "../service/implementation/DataExtractionService";
import { DataExtractionController } from "../controller/implementation/DataExtractionController";
import { upload } from "../config/multerConfig";
import { MulterRequest } from "../interfaces/IMulter";

const router = Router();

const dataExtractionService = new DataExtractionService();
const dataExtractionController = new DataExtractionController(dataExtractionService);

router.post(
  '/extract-data',
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
   await dataExtractionController.extractAadharController(req as unknown as MulterRequest, res)
  }
);

export default router;
