import { Order } from '../entity/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductItem } from './product-item.entity';
import { Product } from './product.entity';

export interface ItemDetailCommand {
  productName: string;
  price: number;
  quantity: number;
}

@Entity('order-item')
export class OrderItem {
  static MAX_QUANTITY = 5;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductItem, (productItem) => productItem.orderItem)
  productItem: ProductItem;

  @Column()
  productName: string;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  constructor(itemCommand: ItemDetailCommand) {
    if (!itemCommand) {
      return;
    }
    if (itemCommand.quantity > OrderItem.MAX_QUANTITY) {
      throw new Error(
        'Quantity of items cannot exceed ' + OrderItem.MAX_QUANTITY,
      );
    }

    this.productName = itemCommand.productName;
    this.quantity = itemCommand.quantity;
    this.price = itemCommand.price;
  }
}
