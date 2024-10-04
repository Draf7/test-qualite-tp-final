import { Injectable } from '@nestjs/common';
import { Product } from 'src/order/domain/entity/product.entity';
import { EmailService } from './email-product.service';

@Injectable()
export class ProductService {
  constructor(private readonly emailService: EmailService) {}

  public async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = Product.createProduct(productData, this.emailService);
    return product;
  }
}
