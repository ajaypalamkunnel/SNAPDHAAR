export interface MulterRequest extends Request {
  files?: {
    front?: Express.Multer.File[];
    back?: Express.Multer.File[];
    [fieldname: string]: Express.Multer.File[] | undefined;
  };
}
