import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 1500 })
  amount: number;

  constructor(name: string, code: string, amount: number = 1500) {
    this.name = name;
    this.code = code;
    this.amount = amount;
  }

  static createPromotion(promotionData: Partial<Promotion>): Promotion {
    this.validatePromotion(promotionData);
    return new Promotion(promotionData.name, promotionData.code, promotionData.amount);
  }

  private static validatePromotion(promotionData: Partial<Promotion>): void {
    if (!promotionData.name || typeof promotionData.name !== 'string') {
      throw new BadRequestException('Le nom de la promotion est obligatoire.');
    }

    if (!promotionData.code || typeof promotionData.code !== 'string') {
      throw new BadRequestException('Le code de la promotion est obligatoire.');
    }
  }
}
