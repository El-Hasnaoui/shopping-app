import { Request } from "express";

export interface CreateProductDto {
  title: string;
  price: number;
  userId: string;
  files: Request["files"];
}
export interface UpdtaeProductDto {
  title: string;
  price: number;
  userId: string;
  productId: string;
}
export interface DeleteProductDto {
  productId: string;
  userId: string;
}
export interface AddImagesDto {
  productId: string;
  userId: string;
  files: Request["files"];
}
export interface deleteImagesDto {
  productId: string;
  userId: string;
  imageIds: Array<string>;
}
