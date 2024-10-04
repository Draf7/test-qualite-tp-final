import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { OrderItem } from './order-item.entity';
import { EmailService } from 'src/order/application/use-case/email-product.service';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  private emailService: EmailService;

  constructor(
    name: string,
    price: number,
    description: string,
    stock: number = 0,
    emailService: EmailService,
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock;
    this.emailService = emailService;
  }

  static createProduct(productData: Partial<Product>, emailService: EmailService): Product {
    try {
      this.validateProduct(productData);

      return new Product(
        productData.name,
        productData.price,
        productData.description,
        productData.stock || 0,
        emailService,
      );
    } catch (error) {
      throw error;
    }
  }

  private static validateProduct(productData: Partial<Product>): void {
    if (!productData.name || typeof productData.name !== 'string') {
      throw new BadRequestException('Le nom du produit est obligatoire et doit être une chaîne de caractères.');
    }

    if (isNaN(productData.price) || productData.price <= 0) {
      throw new BadRequestException('Le prix du produit doit être un nombre positif.');
    }

    if (!productData.description || typeof productData.description !== 'string') {
      throw new BadRequestException('La description du produit est obligatoire et doit être une chaîne de caractères.');
    }

    if (isNaN(productData.stock)) {
      productData.stock = 0;
    }
  }

  public canBeDeleted(): void {
    if (this.orderItems && this.orderItems.length > 0) {
      throw new BadRequestException('Ce produit est lié à une ou plusieurs commandes et ne peut pas être supprimé.');
    }
  }

  public static editProduct(product: Product, updatedData: Partial<Product>): void {
    if (!updatedData.name || !updatedData.price || !updatedData.description) {
      throw new BadRequestException('Le nom, le prix et la description sont obligatoires pour modifier le produit.');
    }
    product.name = updatedData.name;
    product.price = updatedData.price;
    product.description = updatedData.description;
  }

  static filterActive(products: Product[], isActive: boolean): Product[] {
    return products.filter(product => product.isActive === isActive);
  }

  decrementStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new BadRequestException('Quantité demandée supérieure au stock disponible.');
    }
    this.stock -= quantity;
    this.checkStockAndNotify();
  }

  private async checkStockAndNotify(): Promise<void> {
    if (this.stock === 0) {
      await this.notifyAdmin();
    }
  }

  private async notifyAdmin(): Promise<void> {
    await this.emailService.sendEmail(
      'admin@test.fr',
      'Alerte : Stock épuisé',
      `Le produit ${this.name} est en rupture de stock.`
    );
  }
}
