import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { AuthGuard } from "./shared/decorators/auth.guard";
import { AuthType } from "./shared/enums/auth-type.enum";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @AuthGuard(AuthType.None)
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @AuthGuard(AuthType.Bearer)
  @Get("secure")
  getProtectedResource() {
    return this.appService.getSecureResource();
  }
}
