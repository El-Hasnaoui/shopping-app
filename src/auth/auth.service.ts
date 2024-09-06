import { NextFunction } from "express";
import { UserDTO } from "./dtos/auth.dto";
import { userService } from "./user/user.service";
import {
  AuthentificationService,
  BadRequestError,
} from "@shopp-app-hsn/common";

export class AuthService {
  static async signUp(userinfo: UserDTO, errorCallBack: NextFunction) {
    const existingUser = await userService.findOneByEmail(userinfo.email);
    if (existingUser) {
      return errorCallBack(
        new BadRequestError("user exist with the same email")
      );
    }
    const user = await userService.create(userinfo);
    user.save();
    const jwt = AuthentificationService.generateJwtToken(
      {
        email: user.email,
        id: user.id,
      },
      process.env.JWT_KEY!
    );
    return jwt;
  }
  static async signIn(userinfo: UserDTO, errorCallBack: NextFunction) {
    const user = await userService.findOneByEmail(userinfo.email);
    if (!user) {
      return errorCallBack(new BadRequestError("wrong credentials"));
    }
    const isValid = await AuthentificationService.passwordCompare(
      userinfo.password,
      user.password
    );
    if (!isValid) {
      return errorCallBack(new BadRequestError("wrong credentials"));
    }
    const jwt = AuthentificationService.generateJwtToken(
      {
        email: user.email,
        id: user.id,
      },
      process.env.JWT_KEY!
    );
    return jwt;
  }
}
