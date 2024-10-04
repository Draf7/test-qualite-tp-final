import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateOrderCommand, Order } from "src/order/domain/entity/order.entity";
import { OrderRepositoryInterface } from "src/order/domain/port/persistance/order.repository.interface";
import { ProductService } from "./create-product.service";
import { PromotionService } from "./promotion.service";

@Injectable()
export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productService: ProductService,
    private readonly promotionService: PromotionService,
  ) {}

  public async execute(createOrderCommand: CreateOrderCommand, promotionCode?: string): Promise<Order> {
    const validatedProducts = await Promise.all(
      createOrderCommand.items.map(item => this.productService.createProduct(item))
    );

    const transformedItems = validatedProducts.map(product => ({
      productName: product.name,
      price: product.price,
      quantity: 1
    }));

    const order = new Order({
      ...createOrderCommand,
      items: transformedItems,
    });

    if (promotionCode) {
      const promotion = await this.promotionService.findByCode(promotionCode);
      if (!promotion) {
        throw new BadRequestException('Le code de promotion est invalide.');
      }
      order.applyPromotion(promotion);
    }

    return await this.orderRepository.save(order);
  }
}
