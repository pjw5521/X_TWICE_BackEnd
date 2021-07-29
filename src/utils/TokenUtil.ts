import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { TokenClaims, TokenPayload } from "../types/tokens";

export class TokenUtil {
    
    async signToken() {
        const claims: TokenClaims = {
            id: "jiwon",
            account: "jiwon2"
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