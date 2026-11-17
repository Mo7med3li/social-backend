import { model, Schema } from "mongoose";
import { IBlackListedTokens } from "../../common/interfaces/user.interface";

const BlackListedTokensSchema = new Schema<IBlackListedTokens>({
  tokenId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const BlackListedTokensModel = model<IBlackListedTokens>(
  "BlackListedTokens",
  BlackListedTokensSchema,
);
