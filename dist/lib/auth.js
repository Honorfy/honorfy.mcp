export class EnvUserTokenProvider {
    token;
    constructor(token) {
        this.token = token;
    }
    async getAccessToken() {
        return this.token;
    }
}
export function createAccessTokenProvider(config) {
    return new EnvUserTokenProvider(config.HONORFY_USER_TOKEN);
}
//# sourceMappingURL=auth.js.map