import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.getHttpAdapter().getInstance().set("trust proxy", true);
 
  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }));
 
  // 3000 = frontend chay bang Docker (qua Nginx), 3001 = chay vite truc tiep
  // luc dev nhu huong dan trong README. Thieu 3001 thi lam dung theo README se
  // dang nhap khong duoc: trinh duyet chan loi goi /api/auth/login vi CORS.
  const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3001"
  ).split(",");
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
 
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`SEAL Hackathon BFF listening on http://localhost:${port}`);
}
 
bootstrap();