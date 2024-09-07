import { BadRequestError, NotAuthorizedError } from "@shopp-app-hsn/common";
import {
  AddImagesDto,
  CreateProductDto,
  deleteImagesDto,
  DeleteProductDto,
  UpdtaeProductDto,
} from "./dtos/product.dto";
import { productService, ProductService } from "./product/product.services";

export class SellerService {
  constructor(public produtService: ProductService) {}
  async addProduct(productDto: CreateProductDto) {
    return await this.produtService.create(productDto);
  }
  async updateProduct(updateProductDto: UpdtaeProductDto) {
    const product = await this.produtService.getOneById(
      updateProductDto.productId
    );
    if (!product) return new BadRequestError("product not found");
    if (product.user.toString() !== updateProductDto.userId) {
      return new NotAuthorizedError();
    }
    return await this.produtService.update(updateProductDto);
  }
  async deleteProduct(deleteProductDto: DeleteProductDto) {
    const product = await this.produtService.getOneById(
      deleteProductDto.productId
    );
    if (!product) return new BadRequestError("product not found");
    if (product.user.toString() !== deleteProductDto.userId) {
      return new NotAuthorizedError();
    }
    return await this.produtService.delete(deleteProductDto);
  }
  async addProductImages(addImagesDto: AddImagesDto) {
    const product = await this.produtService.getOneById(addImagesDto.productId);
    if (!product) return new BadRequestError("product not found");
    if (product.user.toString() !== addImagesDto.userId) {
      return new NotAuthorizedError();
    }
    return await this.produtService.addImages(addImagesDto);
  }
  async deleteProductImages(deleteImagesDto: deleteImagesDto) {
    const product = await this.produtService.getOneById(
      deleteImagesDto.productId
    );
    if (!product) return new BadRequestError("product not found");
    if (product.user.toString() !== deleteImagesDto.userId) {
      return new NotAuthorizedError();
    }
    return await this.produtService.deleteImages(deleteImagesDto);
  }
}

export const sellerService = new SellerService(productService);
