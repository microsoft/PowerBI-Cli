# powerbi-cli
Power BI command line interface for managing Power BI Embedded workspace collections

[![Build Status](https://img.shields.io/travis/Microsoft/PowerBI-Cli/master.svg)](https://travis-ci.org/Microsoft/PowerBI-Cli)
[![NPM Version](https://img.shields.io/npm/v/powerbi-cli.svg)](https://www.npmjs.com/package/powerbi-cli)
[![NPM Total Downloads](https://img.shields.io/npm/dt/powerbi-cli.svg)](https://www.npmjs.com/package/powerbi-cli)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/powerbi-cli.svg)](https://www.npmjs.com/package/powerbi-cli)

## Installation
Install from npm

`npm install powerbi-cli -g`

## global flags
The following global flags are available to all commands.  These can be stored with the `config` command

-c --collection
> The Power BI workspace collection name

-w --workspace
> The Power BI workspace

-k --accessKey
> The Power BI access key.  This key can be acquired from your Power BI workspace collection within your azure subscription

-b --baseUri
> The base URI that will be used to call the Power BI REST apis.  The default value is https://api.powerbi.com.

-r --reportId
> The Power BI report id

-h --help
> Displays command line help

### Help
**Display root level help**

`powerbi -h`

**Display command specific help**

`powerbi <command> -h`

## Commands

### config
Gets and sets configuration values that are reused in commands. Config values are stored within a `.powerbirc` file.  If you store access keys please ensure that you **do not** commit these values to any public source control.  If your access keys are compromised a user can take full control over your Power BI workspace collection.  If you feel your account was compromised you can regenerate your access keys in the azure portal.

**Setting new configuration values**

`powerbi config -c <collection> -k <accessKey>`

**Getting a list of all configured values**

`powerbi config`
#### get-workspaces
Gets a list of all workspaces within a workspace collection

`powerbi get-workspaces -c <collection> -k <accessKey>`
#### create-workspaces
Creates a new workspaced within a workspace collection

`powerbi create-workspace -c <collection> -k <accessKey>`
#### get-datasets
Gets a list of all datasets within a workspace

`powerbi get-datasets -c <collection> -w <workspaceId> -k <accessKey>`
#### delete-dataset
Deletes a dataset and any underlying linked reports

`powerbi delete-dataset -c <collection> -w <workspaceId> -k <accessKey> -d <datasetId>`
#### get-reports
Gets a list of all reports within a workspace

`powerbi get-reports -c <collection> -w <workspaceId> -k <accessKey>`
#### import
Imports a PBIX file into a 

`powerbi import -c <collection> -w <workspaceId> -k <accessKey> -f <file> -n [name] -o [overwrite]`
#### update-connection
Updates connection strings and/or credentials for an existing dataset

`powerbi update-connection -c <collection> -w <workspaceId> -k <accessKey> -d <datasetId> -s [connectionString] -u [username] -p [password]`
#### create-embed-token
Creates a Power BI embed token

`powerbi create-embed-token -c <collection> -k <accessKey> -w <workspaceId> -r <reportId> -u [username] --roles [roles1,roles2,...]`

`powerbi create-embed-token -c <collection> -k <accessKey> -w <workspaceId> -d <datasetId> -u [username] --roles [roles1,roles2,...]`

> Examples

To create a Power BI embed token with specific user and one role:

`powerbi create-embed-token -c <collection> -k <key>...key -w 06640...744d8f10  -r 07842...e30  -u "Ali Hamud" --roles "Developer"`

To create a Power BI embed token with specific user and multiple roles:

`powerbi create-embed-token -c <collection> -k <key> -w 06640...744d8f10  -r 07842...e30  -u "Ali Hamud" --roles "Developer,Manager"`

To carete Power BI embed token to create a report using dataset

`powerbi create-embed-token -c <collection> -k <key> -w 06640...744d8f10  -d 12532...b13  -u "Ali Hamud" --roles "Developer,Manager"`

