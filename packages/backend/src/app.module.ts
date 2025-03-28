import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NearmissModule } from "./modules/nearmiss/nearmiss.module";
import { LogModule } from "@nearmiss-manager/log/log.module";
import { LogService } from "@nearmiss-manager/log/log.service";
import { CustomTypeOrmLogger } from "@nearmiss-manager/log/custom-logger/typeorm-logger";
import { getSecretValue } from "@nearmiss-manager/common/utils/secret-manager";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [LogModule],
      useFactory: async (logService: LogService) => {
        if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "stg") {
          const secret = await getSecretValue(process.env.DB_SECRET_NAME);
          return {
            type: "postgres",
            host: secret.proxyhost,
            port: parseInt(secret.port),
            username: secret.username,
            password: secret.password,
            database: process.env.DB_DATABASE,
            autoLoadEntities: true,
            synchronize: false,
            logging: true,
            logger: new CustomTypeOrmLogger(logService),
          };
        } else {
          return {
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            autoLoadEntities: true,
            synchronize: false,
            logging: true,
            logger: new CustomTypeOrmLogger(logService),
          };
        }
      },
      inject: [LogService],
    }),
    LogModule,
    NearmissModule,
  ],
})
export class AppModule {}
