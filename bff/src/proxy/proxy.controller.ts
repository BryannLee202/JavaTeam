import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { Method } from "axios";
import { ACCESS_TOKEN_COOKIE } from "../common/cookies";
import { ProxyService } from "./proxy.service";

/**
 * Generic pass-through proxy for every /api/** route not handled by a more specific
 * BFF controller. Reads the access token from the httpOnly cookie set at login and
 * forwards it as a Bearer token to Spring Boot.
 */
@Controller("api")
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All("*")
  async proxy(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies?.[ACCESS_TOKEN_COOKIE];
    const backendPath = req.originalUrl;
    const result = await this.proxyService.forward(
      req.method as Method,
      backendPath,
      accessToken,
      req.body,
      req.query
    );

    if (backendPath.includes("/export") || backendPath.endsWith(".xlsx")) {
      if (result.headers && result.headers["content-type"]) {
        res.setHeader("Content-Type", String(result.headers["content-type"]));
      }
      if (result.headers && result.headers["content-disposition"]) {
        res.setHeader("Content-Disposition", String(result.headers["content-disposition"]));
      }
      return res.status(result.status).send(result.data);
    }

    res.status(result.status).json(result.data);
  }
}
