import { Model } from "mongoose";
import { IBlackListedTokens } from "../../common/interfaces/user.interface";
import { BaseRepository } from "./base.repo";

export class BlackListedTokenRepository extends BaseRepository<IBlackListedTokens> {
  constructor(protected _blackListedTokensModel: Model<IBlackListedTokens>) {
    super(_blackListedTokensModel);
  }
}
