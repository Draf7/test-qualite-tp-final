import { Injectable } from '@nestjs/common';
import { Promotion } from 'src/order/domain/entity/promotion.entity';
import { PromotionRepositoryInterface } from 'src/order/domain/port/persistance/promotion.repository.interface';

@Injectable()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepositoryInterface) {}

  public async findByCode(code: string): Promise<Promotion | null> {
    return await this.promotionRepository.findByCode(code);
  }

  public async createPromotion(promotionData: Partial<Promotion>): Promise<Promotion> {
    const promotion = Promotion.createPromotion(promotionData);
    return await this.promotionRepository.save(promotion);
  }
}
