export interface TokenClaims {
    id: string;
    account: string;
}

export interface TokenPayload extends TokenClaims {
    lat: number;
    exp: number;
}