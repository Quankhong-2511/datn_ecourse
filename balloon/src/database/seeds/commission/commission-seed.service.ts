import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commission } from 'src/course/entities/commission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommissionSeedService {
  constructor(
    @InjectRepository(Commission)
    private repository: Repository<Commission>,
  ) {}

  async run() {
    const countCommission = await this.repository.find();

    if (countCommission.length === 0) {
      await this.repository.save(
        this.repository.create({
          level_1: 30,
          level_2: 10,
          level_3: 5,
          level_4: 3,
          level_5: 2,
        }),
      );
    }
  }
}
