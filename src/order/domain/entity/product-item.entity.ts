import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Product } from './product.entity';

@Entity()
export class ProductItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.id)
  orderItem: OrderItem;

  @ManyToOne(() => Product, (product) => product.name)
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  constructor(orderItem: OrderItem, product: Product, quantity: number, price: number) {
    this.orderItem = orderItem;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }
}