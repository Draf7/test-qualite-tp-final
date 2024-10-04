import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email-product.service';
import { Product } from 'src/order/domain/entity/product.entity';
import { BadRequestException } from '@nestjs/common';
import { ProductService } from './create-product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should create a product successfully', async () => {
    const productData = {
      name: 'Test Product',
      price: 100,
      description: 'A test product',
      stock: 10,
    };

    const result = await productService.createProduct(productData);

    expect(result).toBeInstanceOf(Product);
    expect(result.name).toBe('Test Product');
    expect(result.price).toBe(100);
    expect(result.description).toBe('A test product');
    expect(result.stock).toBe(10);
  });

  it('should set default stock to 0 if stock is not provided', async () => {
    const productData = {
      name: 'Product without stock',
      price: 50,
      description: 'A product without specified stock',
    };

    const result = await productService.createProduct(productData);

    expect(result.stock).toBe(0);
  });

  it('should throw BadRequestException if product data is invalid', async () => {
    const productData = {
      name: '',
      price: 0,
      description: '',
    };

    await expect(productService.createProduct(productData)).rejects.toThrow(BadRequestException);
  });

  it('should send email when stock reaches 0', async () => {
    const productData = {
      name: 'Test Product',
      price: 100,
      description: 'A test product',
      stock: 0,
    };

    await productService.createProduct(productData);

    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'admin@test.fr',
      'Alerte : Stock épuisé',
      'Le produit Test Product est en rupture de stock.',
    );
  });
});
