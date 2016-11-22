import { PowerBIClient } from '../powerBIClient';
import { ServiceCallback } from 'ms-rest';
import * as operations from '../../autorest/operations';
import * as models from '../models';
export declare class Imports implements operations.Imports {
    private client;
    private base;
    constructor(client: PowerBIClient);
    getImports(collectionName: string, workspaceId: string, callback: ServiceCallback<models.ODataResponseListImport>): void;
    getImports(collectionName: string, workspaceId: string, options: {
        customHeaders?: {
            [headerName: string]: string;
        };
    }, callback: ServiceCallback<models.ODataResponseListImport>): void;
    postImport(collectionName: string, workspaceId: string, importInfo: models.ImportInfo, callback: ServiceCallback<models.ImportModel>): void;
    postImport(collectionName: string, workspaceId: string, importInfo: models.ImportInfo, options: models.ImportFileOptions, callback: ServiceCallback<models.ImportModel>): void;
    getImportById(collectionName: string, workspaceId: string, importId: string, options: models.ImportFileOptions, callback: ServiceCallback<models.ImportModel>): void;
    getImportById(collectionName: string, workspaceId: string, importId: string, callback: ServiceCallback<models.ImportModel>): void;
    uploadFile(collectionName: string, workspaceId: string, filePath: string, callback: ServiceCallback<models.ImportModel>): void;
    uploadFile(collectionName: string, workspaceId: string, filePath: string, options: models.ImportFileOptions, callback: ServiceCallback<models.ImportModel>): void;
}
