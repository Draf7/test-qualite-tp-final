import { Product } from "../../entity/product.entity";

export interface ProductRepositoryInterface {
  findById(productId: number): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  delete(productId: number): Promise<void>;
  isProductLinkedToOrder(productId: number): Promise<boolean>;
  findAll(): Promise<Product>;
  
  }

  