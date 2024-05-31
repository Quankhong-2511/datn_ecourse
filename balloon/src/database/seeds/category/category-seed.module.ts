import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Commission } from "src/course/entities/commission.entity";
import { Category } from "src/course/entities/category.entity";
import { CategorySeedService } from "./category-seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategorySeedService],
  exports: [CategorySeedService],
})
export class CategorySeedModule {}
