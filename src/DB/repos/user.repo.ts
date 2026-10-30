import { Model } from "mongoose";
import { IUser } from "../../common/interfaces/user.interface";
import { BaseRepository } from "./base.repo";

export class UserRepository extends BaseRepository<IUser> {
  constructor(protected _userMode: Model<IUser>) {
    super(_userMode);
  }

  //   find user by email
  async findUserByEmail() {}
}
