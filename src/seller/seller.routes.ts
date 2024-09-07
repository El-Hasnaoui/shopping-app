import { NextFunction, Request, Response, Router } from "express";
import {
  BadRequestError,
  CustomError,
  Uploader,
  uploadMiddlwareOptions,
} from "@shopp-app-hsn/common";
import { sellerService } from "./seller.services";
const router = Router();
const uploder = new Uploader();
const middlewareOptions: uploadMiddlwareOptions = {
  types: ["images/png", "images/jpeg"],
  fieldName: "image",
};
const uploaderMiltipleFilesMidd =
  uploder.uploadMultipleFiles(middlewareOptions);
router.post(
  "/product/new",
  uploaderMiltipleFilesMidd,
  (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    if (!req.files) return next(new BadRequestError("files are required"));
    if (req.uploaderError) {
      return next(new BadRequestError(req.uploaderError.message));
    }
    const product = sellerService.addProduct({
      title,
      price,
      userId: req.currentUser!.id,
      files: req.files,
    });
    res.status(201).send(product);
  }
);
router.post(
  "/product/:id/update",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const result = await sellerService.updateProduct({
      userId: req.currentUser!.id,
      price,
      title,
      productId: id,
    });
    if (result instanceof CustomError) return next(result);
    return res.status(200).send(result);
  }
);
router.post(
  "/product/:id/delete",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await sellerService.deleteProduct({
      productId: id,
      userId: req.currentUser!.id,
    });
    if (result instanceof CustomError) return next(result);
    return res.status(200).send(true);
  }
);
router.post(
  "/product/:id/addImages",
  uploaderMiltipleFilesMidd,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files) return next(new BadRequestError("files are required"));
    if (req.uploaderError) {
      return next(new BadRequestError(req.uploaderError.message));
    }
    const { id } = req.params;
    const result = await sellerService.addProductImages({
      productId: id,
      userId: req.currentUser!.id,
      files: req.files,
    });
    if (result instanceof CustomError) return next(result);
    return res.status(200).send(true);
  }
);
router.post(
  "/product/:id/deleteImages",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { imageIds } = req.body;
    const result = sellerService.deleteProductImages({
      imageIds,
      productId: id,
      userId: req.currentUser!.id,
    });
    if (result instanceof CustomError) return next(result);
    return res.status(200).send(result);
  }
);

export { router as sellerRouters };
