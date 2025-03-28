import { Module } from "@nestjs/common";
import { NearmissController } from "./nearmiss.controller";
import { NearmissService } from "./nearmiss.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NearmissInfoEntity } from "@nearmiss-manager/database/entities/nearmiss_info.entity";
import { LogModule } from "@nearmiss-manager/log/log.module";
/** ヒヤリハットAPIモジュール */
@Module({
  imports: [TypeOrmModule.forFeature([NearmissInfoEntity]), LogModule],
  controllers: [NearmissController],
  providers: [NearmissService],
})
export class NearmissModule {}
