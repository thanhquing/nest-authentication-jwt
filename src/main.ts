import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";
import cors from "@fastify/cors";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create(AppModule, fastifyAdapter);
  const configService = app.get<ConfigService>(ConfigService);
  fastifyAdapter.register(cors, {
    origin: [configService.get<string>("ENDPOINT_CORS")],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const port = configService.get<number>("NODE_API_PORT") || 3000;
  await app.listen(port, "0.0.0.0");

  const isDev = configService.get<string>("NODE_ENV") === "dev";

  if (isDev) {
    Logger.debug(
      `${await app.getUrl()} - Environment: ${configService.get<string>("NODE_ENV")}`,
      "Environment"
    );
  }
}
bootstrap();
