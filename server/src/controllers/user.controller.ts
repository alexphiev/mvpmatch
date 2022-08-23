import {
  Get,
  Route,
  Tags,
  Post,
  Body,
  Path,
  Security,
  Patch,
  Delete,
  Put,
} from "tsoa";
import { DeleteResult } from "typeorm";
import { User } from "../models/user";
import {
  getUsers,
  createUser,
  IUserPayload,
  getUser,
  updateUser,
  deleteUser,
  IUserPutPayload,
} from "../repositories/user.repository";

@Route("users")
@Tags("User")
export default class UserController {
  @Security("JWT")
  @Get("/")
  public async getUsers(): Promise<Array<User>> {
    return getUsers();
  }

  @Post("/")
  public async createUser(@Body() body: IUserPayload): Promise<User> {
    return createUser(body);
  }

  @Security("JWT")
  @Get("/:id")
  public async getUser(@Path() id: string): Promise<User | null> {
    return getUser(Number(id));
  }

  @Security("JWT")
  @Put("/:id")
  public async updateUser(
    @Put() id: string,
    @Body() body: IUserPutPayload
  ): Promise<User | null> {
    return updateUser(Number(id), body);
  }

  @Security("JWT")
  @Delete("/:id")
  public async deleteUser(@Path() id: string): Promise<DeleteResult> {
    return deleteUser(Number(id));
  }
}
