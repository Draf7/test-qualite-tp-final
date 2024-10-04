
import { Injectable } from '@nestjs/common';
import { Product } from 'src/order/domain/entity/product.entity';
import { ProductRepositoryInterface } from 'src/order/domain/port/persistance/product.repository.interface';

@Injectable()
export class EditProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  public async execute(productId: number, updatedData: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    Product.editProduct(product, updatedData);

    return await this.productRepository.save(product);
  }
}
