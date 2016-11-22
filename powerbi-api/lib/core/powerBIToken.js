"use strict";
var jwt = require('jwt-simple');
var util_1 = require('./util');
var PowerBIToken = (function () {
    function PowerBIToken(expiration) {
        this.expiration = expiration;
        this.claims = {
            ver: '0.2.0',
            aud: 'https://analysis.windows.net/powerbi/api',
            iss: 'Power BI Node SDK'
        };
    }
    PowerBIToken.createReportEmbedToken = function (workspaceCollectionName, workspaceId, reportId, username, roles, expiration) {
        if (username === void 0) { username = null; }
        if (roles === void 0) { roles = null; }
        if (expiration === void 0) { expiration = null; }
        if (roles && !username) {
            throw new Error('Cannot have an empty or null Username claim with the non-empty Roles claim');
        }
        var token = new PowerBIToken(expiration);
        token.addClaim('wcn', workspaceCollectionName);
        token.addClaim('wid', workspaceId);
        token.addClaim('rid', reportId);
        if (username != null) {
            token.addClaim('username', username);
            if (roles != null) {
                token.addClaim('roles', roles);
            }
        }
        return token;
    };
    PowerBIToken.prototype.setTokenExpiration = function () {
        var nowSeconds = util_1.Util.getUnixTime(new Date());
        var expirationSeconds = this.expiration ? util_1.Util.getUnixTime(this.expiration) : nowSeconds + 3600;
        if (expirationSeconds <= nowSeconds) {
            throw new Error('Token expiration must be in the future');
        }
        this.addClaim('nbf', nowSeconds);
        this.addClaim('exp', expirationSeconds);
    };
    PowerBIToken.prototype.addClaim = function (key, value) {
        this.claims[key] = value;
    };
    PowerBIToken.prototype.generate = function (accessKey) {
        this.setTokenExpiration();
        return jwt.encode(this.claims, accessKey);
    };
    return PowerBIToken;
}());
exports.PowerBIToken = PowerBIToken;
//# sourceMappingURL=powerBIToken.js.map