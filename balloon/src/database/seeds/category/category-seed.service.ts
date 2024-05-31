import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/course/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(Category)
    private repository: Repository<Category>,
  ) {}

  async run() {
    const countCategory = await this.repository.find();

    if (countCategory.length === 0) {
      await this.repository.save(
        this.repository.create({
          title: 'NestJs',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'HTML',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'CSS',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'JavaScript',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'DATABASE',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'Python',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'Java',
        }),
      );
      await this.repository.save(
        this.repository.create({
          title: 'C/C++',
        }),
      );
    }
  }
}
