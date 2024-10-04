import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/order/domain/entity/product.entity';
import { ProductRepositoryInterface } from 'src/order/domain/port/persistance/product.repository.interface';
import { DeleteProductService } from './delete.product.service';
import { EmailService } from './email-product.service';

describe('DeleteProductService', () => {
  let deleteProductService: DeleteProductService;
  let productRepository: jest.Mocked<ProductRepositoryInterface>;
  let emailService: EmailService;

  beforeEach(() => {
    productRepository = {
        findById: jest.fn(),
        delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepositoryInterface>;

    emailService = new EmailService();

    deleteProductService = new DeleteProductService(productRepository, null);
  });

  it('should throw BadRequestException if product is linked to orders', async () => {
    const product = new Product('Test Product', 100, 'A test product', 10, emailService);

    product.canBeDeleted = jest.fn().mockImplementation(() => {
      throw new BadRequestException('Ce produit est lié à une ou plusieurs commandes et ne peut pas être supprimé.');
    });

    productRepository.findById.mockResolvedValue(product);

    await expect(deleteProductService.execute(1)).rejects.toThrow(BadRequestException);
    expect(product.canBeDeleted).toHaveBeenCalled();
  });

  it('should delete product if it can be deleted', async () => {
    const product = new Product('Test Product', 100, 'A test product', 10, emailService);

    product.canBeDeleted = jest.fn();

    productRepository.findById.mockResolvedValue(product);

    await deleteProductService.execute(1);

    expect(product.canBeDeleted).toHaveBeenCalled();
    expect(productRepository.delete).toHaveBeenCalledWith(1);
  });
});
