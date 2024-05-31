import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommissionSeedService } from "./commission-seed.service";
import { Commission } from "src/course/entities/commission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Commission])],
  providers: [CommissionSeedService],
  exports: [CommissionSeedService],
})
export class CommissionSeedModule {}
