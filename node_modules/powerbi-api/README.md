[![Build Status](https://travis-ci.org/Microsoft/PowerBI-Node.svg?branch=add-travis-ci)](https://travis-ci.org/Microsoft/PowerBI-Node)

# PowerBI-Node
Node SDK and client library for the Power BI Embedded REST APIs.

## Installation
```
npm install powerbi-api
```

## Usage
Creating a new client requires referencing the Power BI SDK as well as the Microsoft Rest Client.  For an example of the Node SDK in action see the [Power BI Node CLI](https://github.com/Microsoft/PowerBI-Cli).
```javascript
var powerbi = require('powerbi-api');
var msrest = require('ms-rest');

var credentials = new msrest.TokenCredentials('{AccessKey}', "AppKey");
var client = new powerbi.PowerBIClient(credentials);

// Example API call
client.workspaces.getWorkspacesByCollectionName('{WorkspaceCollection}', function(err, result) {
    // Your code here
});
```

### APIs
The following APIs groups are available:
- Datasets
- Gateways
- Imports
- Reports
- Workspaces

## PowerBI API Calls
All API calls use the AppKey to authenticate the API calls. The AppKey can be retreived from Azure portal.
Each API call sets the following HTTP header:  
- Authorization: AppKey {AccessKey}

**WARNING** - Never expose your access keys client side in your application.  If your access key is compromised a malicious user can take over control of your workspace collection.  Access keys can be re-generated for your workspace collection within the Azure portal.

## Creating Embed Tokens
Power BI Embedded uses embed token, which are HMAC signed JSON Web Tokens.  The tokens are signed with the access key from your Azure Power BI Embedded workspace collection.
Embed tokens are used to provide read only access to a report to embed into an application.

### Required Claims
- ver: 0.2.0
- wcn: {WorkspaceCollectionName}
- wid: {WorkspaceId}
- rid: {ReportId}
- aud: https://analysis.windows.net/powerbi/api
- nbp: Token valid not before in Unix EPOCH time
- exp: Token expiration in Unix EPOCH time

```javascript
var powerbi = require('powerbi-api');
var token = powerbi.PowerBIToken.createReportEmbedToken('{WorkspaceCollection}', '{workspaceId}', '{reportId}');

var jwt = token.generate('{AccessKey}');
```

## Token Example
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZXIiOiIwLjIuMCIsIndjbiI6IlN1cHBvcnREZW1vIiwid2lkIjoiY2E2NzViMTktNmMzYy00MDAzLTg4MDgtMWM3ZGRjNmJkODA5IiwicmlkIjoiOTYyNDFmMGYtYWJhZS00ZWE5LWEwNjUtOTNiNDI4ZWRkYjE3IiwiaXNzIjoiUG93ZXJCSVNESyIsImF1ZCI6Imh0dHBzOi8vYW5hbHlzaXMud2luZG93cy5uZXQvcG93ZXJiaS9hcGkiLCJleHAiOjEzNjAwNDcwNTYsIm5iZiI6MTM2MDA0MzQ1Nn0.LgG2y0m24gg3vjQHhkXYYWKSVnGIUYT-ycA6JmTB6tg

### Decoded
The following decoded JSON web token
**Header**
```javascript
{
  "typ": "JWT",
  "alg": "HS256"
}
```

**Payload**
```javascript
{
  "ver": "0.2.0",
  "wcn": "SupportDemo",
  "wid": "ca675b19-6c3c-4003-8808-1c7ddc6bd809",
  "rid": "96241f0f-abae-4ea9-a065-93b428eddb17",
  "iss": "PowerBISDK",
  "aud": "https://analysis.windows.net/powerbi/api",
  "exp": 1360047056,
  "nbf": 1360043456
}
```
