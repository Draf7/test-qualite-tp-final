import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepositoryInterface } from 'src/order/domain/port/persistance/product.repository.interface';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';

@Injectable()
export class DeleteProductService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  public async execute(productId: number): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    product.canBeDeleted();

    await this.productRepository.delete(productId);
  }
}
