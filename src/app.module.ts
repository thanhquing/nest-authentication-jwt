import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Yup from "yup";
import { ThrottlerModule } from "@nestjs/throttler";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.dev", ".env.stage", ".env.prod"],
      validationSchema: Yup.object({
        TYPEORM_HOST: Yup.string().required(),
        TYPEORM_PORT: Yup.number().default(3306),
        TYPEORM_USERNAME: Yup.string().required(),
        TYPEORM_PASSWORD: Yup.string().required(),
        TYPEORM_DATABASE: Yup.string().required(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return [
          {
            ttl: config.get<number>("THROTTLE_TTL"),
            limit: config.get<number>("THROTTLE_LIMIT"),
          },
        ];
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
