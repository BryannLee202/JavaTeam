import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.getHttpAdapter().getInstance().set("trust proxy", true);
 
  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }));
 
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:3000").split(",");
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
 
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`SEAL Hackathon BFF listening on http://localhost:${port}`);
}
 
bootstrap();