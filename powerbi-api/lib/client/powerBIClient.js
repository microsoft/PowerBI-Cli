'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AutorestClient = require('../autorest/powerBIClient');
var operations = require('./operations');
var PowerBIClient = (function (_super) {
    __extends(PowerBIClient, _super);
    function PowerBIClient(credentials, baseUri, options) {
        if (baseUri === void 0) { baseUri = 'https://api.powerbi.com'; }
        _super.call(this, credentials, baseUri, options);
        this.imports = new operations.Imports(this);
    }
    return PowerBIClient;
}(AutorestClient));
exports.PowerBIClient = PowerBIClient;
//# sourceMappingURL=powerBIClient.js.map