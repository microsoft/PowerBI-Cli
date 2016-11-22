export declare class PowerBIToken {
    private claims;
    private expiration;
    constructor(expiration?: Date);
    static createReportEmbedToken(workspaceCollectionName: string, workspaceId: string, reportId: string, username?: string, roles?: string | string[], expiration?: Date): PowerBIToken;
    private setTokenExpiration();
    addClaim(key: string, value: any): void;
    generate(accessKey: string): string;
}
