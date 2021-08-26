export interface TokenClaims {
    user_id: string;
    user_num: number;
    user_account: string;
    user_privatekey: string;
}

export interface TokenPayload extends TokenClaims {
    lat: number;
    exp: number;
}