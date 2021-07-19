export const env = {
    isPRODUCTION: process.env.NODE_ENV == "production", // 운영 환경 여부
    isTEST: process.env.NODE_ENV == "test", // 테스트 환경 여부
    app: {
        apiPrefix: "",
        portNumber: Number(process.env.PORT) || 4000
    }
}