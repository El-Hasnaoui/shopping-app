import { userDoc, userModel } from "@shopp-app-hsn/common";
import { User } from "./user.model";
import { UserDTO } from "../dtos/auth.dto";

export class UserService {
  constructor(public userModel: userModel) {}
  async create(userInfo: UserDTO): Promise<userDoc> {
    const user = new this.userModel({
      email: userInfo.email,
      password: userInfo.password,
    });
    try {
      return await user.save();
    } catch (err) {
      throw new Error("creation failed");
    }
  }
  async findOneByEmail(email: string): Promise<userDoc | null> {
    return this.userModel.findOne({ email });
  }
}

export const userService = new UserService(User);
