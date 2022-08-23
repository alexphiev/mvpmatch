import { ISigninPayload, ISigninResponse, login } from "../repositories/auth.repository";
import { Body, Post, Route, Tags } from "tsoa";

@Route("auth")
@Tags("Auth")
export default class AuthController {
  @Post("/login")
  public async login(@Body() body: ISigninPayload): Promise<ISigninResponse> {
    return login(body);
  }
}
