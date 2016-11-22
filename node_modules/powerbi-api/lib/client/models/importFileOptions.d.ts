export interface ImportFileOptions {
    datasetDisplayName?: string;
    nameConflict?: string;
    customHeaders?: {
        [headerName: string]: string;
    };
}
