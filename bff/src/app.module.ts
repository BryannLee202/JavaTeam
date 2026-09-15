import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CsrfGuard } from "./common/csrf.guard";
import { HealthController } from "./health/health.controller";
import { VotingController } from "./voting/voting.controller";
import { ProxyController } from "./proxy/proxy.controller";
import { ProxyService } from "./proxy/proxy.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ timeout: 15000 }),
    // 30 request/phut la qua chat cho kieu goi cua ung dung nay. Do thuc te
    // bang trinh duyet (tai khoan judge1, du lieu mau demo):
    //   mo /app   -> 28 request   (trang chu giam khao: vong -> bai nop -> diem)
    //   mo /judge -> 21 request
    // Tuc la moi mot man hinh da gan cham tran, mo hai man lien tiep thi BFF
    // tra ThrottlerException va giao dien hien mot loat the bao loi do.
    //
    // Nang len 200 va cho phep chinh bang bien moi truong. Van con la mot muc
    // tran that - chan duoc kieu goi lien tuc bat thuong - chu khong phai bo han.
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL_MS ?? 60_000),
        limit: Number(process.env.THROTTLE_LIMIT ?? 200),
      },
    ]),
  ],
  controllers: [HealthController, AuthController, VotingController, ProxyController],
  providers: [
    AuthService,
    ProxyService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
  ],
})
export class AppModule {}