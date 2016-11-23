import AutorestClient = require('../autorest/powerBIClient');
import * as operations from './operations';
import { ServiceClientCredentials, ServiceClientOptions } from 'ms-rest';
export declare class PowerBIClient extends AutorestClient {
    imports: operations.Imports;
    constructor(credentials: ServiceClientCredentials, baseUri?: string, options?: ServiceClientOptions);
}
