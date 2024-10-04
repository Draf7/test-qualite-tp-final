import { CreateOrderService } from '../use-case/create-order.service';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { PromotionService } from '../use-case/promotion.service';
import { Order } from '../../domain/entity/order.entity';
import { ProductService } from './create-product.service';

class OrderRepositoryFake {
  async save(order: Order): Promise<Order> {
    return order;
  }
}

const productServiceMock = {
  createProduct: jest.fn(),
} as unknown as ProductService;

const promotionServiceMock = {
  applyPromotion: jest.fn(),
} as unknown as PromotionService;

const orderRepositoryFake = new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be created if the order has more than 5 items", () => {
  it('should return an error', async () => {
    const createOrderService = new CreateOrderService(
      orderRepositoryFake,
      productServiceMock,
      promotionServiceMock,
    );

    await expect(
      createOrderService.execute({
        customerName: 'John Doe',
        items: [
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 1', price: 10, quantity: 1 },
          { productName: 'item 1', price: 10, quantity: 1 },
        ],
        shippingAddress: 'Shipping Address',
        invoiceAddress: 'Invoice Address',
      }),
    ).rejects.toThrow();
  });
});
