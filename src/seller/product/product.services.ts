import { ProductModel } from "@shopp-app-hsn/common";
import { Product } from "../product/product.model";
import {
  AddImagesDto,
  CreateProductDto,
  deleteImagesDto,
  DeleteProductDto,
  UpdtaeProductDto,
} from "../dtos/product.dto";
import fs from "fs";
import path from "path";
export class ProductService {
  constructor(public productModel: ProductModel) {}
  async getOneById(productId: string) {
    return await this.productModel.findById(productId);
  }
  async create(productDto: CreateProductDto) {
    const product = new this.productModel({
      title: productDto.price,
      price: productDto.price,
      user: productDto.userId,
      images: this.generateImages(productDto.files),
    });
    return await product.save();
  }
  async update(updateProductDto: UpdtaeProductDto) {
    return await this.productModel.findOneAndUpdate(
      { _id: updateProductDto.productId },
      {
        $set: { title: updateProductDto.title, price: updateProductDto.price },
      },
      { new: true }
    );
  }
  async delete(deleteProductDto: DeleteProductDto) {
    return await this.productModel.findOneAndRemove({
      _id: deleteProductDto.productId,
    });
  }
  async addImages(addImagesDto: AddImagesDto) {
    const images = this.generateImages(addImagesDto.files);
    return await this.productModel.findOneAndUpdate(
      { _id: addImagesDto },
      { $push: { images: { $each: images } } },
      { new: true }
    );
  }
  async deleteImages(deleteImgsDto: deleteImagesDto) {
    return await this.productModel.findOneAndUpdate(
      { _id: deleteImgsDto.productId },
      { $pull: { images: { _id: { $in: deleteImgsDto.imageIds } } } },
      { new: true }
    );
  }

  generateBase64URI(contentType: string, buffer: Buffer) {
    return `data:${contentType};base64${buffer.toString("base64")}`;
  }
  generateImages(files: CreateProductDto["files"]): Array<{ src: string }> {
    let images: Array<Express.Multer.File>;
    if (typeof files === "object") {
      images = Object.values(files).flat();
    } else {
      images = files ? [...files] : [];
    }
    return images.map((image) => {
      let srcObj = {
        src: this.generateBase64URI(
          image.mimetype,
          fs.readFileSync(path.join("upload/" + image.filename))
        ),
      };
      fs.unlink(path.join("upload/" + image.filename), (err) => {
        if (err) throw new Error("internal error");
      });
      return srcObj;
    });
  }
}

export const productService = new ProductService(Product);
