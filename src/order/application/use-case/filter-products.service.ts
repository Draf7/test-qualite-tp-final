import { Injectable } from '@nestjs/common';
import { Product } from 'src/order/domain/entity/product.entity';

@Injectable()
export class FilterProductsService {
  constructor(private readonly products: Product[]) {}

  filterActiveProducts(isActive: boolean): Product[] {
    return Product.filterActive(this.products, isActive);
  }
}
