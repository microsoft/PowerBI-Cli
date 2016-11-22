"use strict";
var ms_rest_1 = require('ms-rest');
var fs = require('fs');
var util = require('util');
var AuorestImports = require('../../autorest/operations/imports');
var msRest = require('ms-rest');
var Imports = (function () {
    function Imports(client) {
        this.base = new AuorestImports(this);
        this.client = client;
    }
    Imports.prototype.getImports = function (collectionName, workspaceId, options, callback) {
        this.base.getImports(collectionName, workspaceId, options, callback);
    };
    Imports.prototype.postImport = function (collectionName, workspaceId, importInfo, options, callback) {
        this.base.postImport.apply(this, arguments);
    };
    Imports.prototype.getImportById = function (collectionName, workspaceId, importId, options, callback) {
        this.base.getImportById.apply(this, arguments);
    };
    Imports.prototype.uploadFile = function (collectionName, workspaceId, filePath, options, callback) {
        var _this = this;
        if (!callback && typeof options === 'function') {
            callback = options;
            options = null;
        }
        if (!callback) {
            throw new Error('callback cannot be null.');
        }
        var datasetDisplayName = (options && options.datasetDisplayName !== undefined) ? options.datasetDisplayName : undefined;
        var nameConflict = (options && options.nameConflict !== undefined) ? options.nameConflict : undefined;
        // Validate
        try {
            if (collectionName === null || collectionName === undefined || typeof collectionName.valueOf() !== 'string') {
                throw new Error('collectionName cannot be null or undefined and it must be of type string.');
            }
            if (workspaceId === null || workspaceId === undefined || typeof workspaceId.valueOf() !== 'string') {
                throw new Error('workspaceId cannot be null or undefined and it must be of type string.');
            }
            if (datasetDisplayName !== null && datasetDisplayName !== undefined && typeof datasetDisplayName.valueOf() !== 'string') {
                throw new Error('datasetDisplayName must be of type string.');
            }
            if (nameConflict !== null && nameConflict !== undefined && typeof nameConflict.valueOf() !== 'string') {
                throw new Error('nameConflict must be of type string.');
            }
            if (filePath === null || filePath === undefined) {
                throw new Error('filePath cannot be null or undefined.');
            }
        }
        catch (error) {
            return callback(error, null, null, null);
        }
        // Construct URL
        var requestUrl = this.client['baseUri'] + '//v1.0/collections/{collectionName}/workspaces/{workspaceId}/imports';
        requestUrl = requestUrl.replace('{collectionName}', encodeURIComponent(collectionName));
        requestUrl = requestUrl.replace('{workspaceId}', encodeURIComponent(workspaceId));
        var queryParameters = [];
        if (datasetDisplayName !== null && datasetDisplayName !== undefined) {
            queryParameters.push('datasetDisplayName=' + encodeURIComponent(datasetDisplayName));
        }
        if (nameConflict !== null && nameConflict !== undefined) {
            queryParameters.push('nameConflict=' + encodeURIComponent(nameConflict));
        }
        if (queryParameters.length > 0) {
            requestUrl += '?' + queryParameters.join('&');
        }
        // trim all duplicate forward slashes in the url
        var regex = /([^:]\/)\/+/gi;
        requestUrl = requestUrl.replace(regex, '$1');
        var formData = {
            file: fs.createReadStream(filePath)
        };
        // Create HTTP transport objects
        var httpRequest = ms_rest_1.WebResource.post(requestUrl);
        httpRequest['url'] = requestUrl;
        httpRequest['method'] = 'POST';
        httpRequest['formData'] = formData;
        httpRequest['headers'] = {};
        // Set Headers
        if (options) {
            for (var headerName in options.customHeaders) {
                if (options.customHeaders.hasOwnProperty(headerName)) {
                    httpRequest.withHeader(headerName, options.customHeaders[headerName]);
                }
            }
        }
        // Send Request
        return this.client.pipeline(httpRequest, function (err, response, responseBody) {
            if (err) {
                return callback(err, null, null, null);
            }
            var statusCode = response.statusCode;
            if (statusCode !== 202) {
                var error = new Error(responseBody);
                error.statusCode = response.statusCode;
                error.request = msRest.stripRequest(httpRequest);
                error.response = msRest.stripResponse(response);
                if (responseBody === '')
                    responseBody = null;
                var parsedErrorResponse;
                try {
                    parsedErrorResponse = JSON.parse(responseBody);
                    if (parsedErrorResponse) {
                        if (parsedErrorResponse.error)
                            parsedErrorResponse = parsedErrorResponse.error;
                        if (parsedErrorResponse.code)
                            error.code = parsedErrorResponse.code;
                        if (parsedErrorResponse.message)
                            error.message = parsedErrorResponse.message;
                    }
                }
                catch (defaultError) {
                    error.message = util.format('Error "%s" occurred in deserializing the responseBody ' +
                        '- "%s" for the default response.', defaultError.message, responseBody);
                    return callback(error, null, null, null);
                }
                return callback(error, null, null, null);
            }
            // Create Result
            var result = null;
            if (responseBody === '')
                responseBody = null;
            // Deserialize Response
            if (statusCode === 202) {
                var parsedResponse = null;
                try {
                    parsedResponse = JSON.parse(responseBody);
                    result = JSON.parse(responseBody);
                    if (parsedResponse !== null && parsedResponse !== undefined) {
                        var resultMapper = new _this.client.models['ImportModel']().mapper();
                        result = _this.client.deserialize(resultMapper, parsedResponse, 'result');
                    }
                }
                catch (error) {
                    var deserializationError = new Error(util.format('Error "%s" occurred in deserializing the responseBody - "%s"', error, responseBody));
                    deserializationError.request = msRest.stripRequest(httpRequest);
                    deserializationError.response = msRest.stripResponse(response);
                    return callback(deserializationError, null, null, null);
                }
            }
            return callback(null, result, httpRequest, response);
        });
    };
    return Imports;
}());
exports.Imports = Imports;
//# sourceMappingURL=imports.js.map