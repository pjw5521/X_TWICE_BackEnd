import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { User } from "../entities/User";
import { TokenClaims, TokenPayload } from "../types/tokens";

export class TokenUtil {
    
    async signToken(user: User) {
        const { user_id, user_num, user_account, user_password, user_privatekey } = user

        const claims: TokenClaims = {
            user_id, user_num, user_account, user_password, user_privatekey
        };

        const signKey = "X_TWICE_BACKEND";

        const signOptions: SignOptions = {
            algorithm: "HS256",
            expiresIn: "1h"
        }

        const newToken = await jwt.sign(claims, signKey, signOptions)
        return newToken;
    }

    async veriftyToken(token: string) {

        const signKey = "X_TWICE_BACKEND";

        /* const signOptions: SignOptions = {
            algorithm: "HS256",
            expiresIn: "1h" 
        } */

        const decoded = await jwt.verify(token, signKey)
        return decoded as TokenPayload;
    }

}