import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { Order } from 'src/order/domain/entity/order.entity';
import { ItemDetailCommand } from 'src/order/domain/entity/order-item.entity';

@Injectable()
export class AddItemToOrderService {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  public async execute(orderId: string, itemCommand: ItemDetailCommand): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new BadRequestException('Order not found.');
    }

    order.addItem(itemCommand);
    return await this.orderRepository.save(order);
  }
}
