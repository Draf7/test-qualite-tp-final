import { Promotion } from "../../entity/promotion.entity";

export interface PromotionRepositoryInterface {
    findByCode(code: string): Promise<Promotion | null>;
    save(promotion: Promotion): Promise<Promotion>;
  }
  