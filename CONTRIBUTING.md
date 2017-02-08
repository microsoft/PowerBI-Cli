# Contributing

## Setup

Clone the repository:
```
git clone https://github.com/Microsoft/PowerBI-Cli.git powerbi-cli
```

Navigate to the cloned directory

Install typescript and local dependencies - you need to run it only once.
```
npm run precontrib
```

## Build:
```
npm run contrib
```

## Running the CLI
Navigate to `/bin` directory and run cli file using node.

```
cd bin & node cli
```

## Running specific command:
Navigate to `/bin` directory and run cli file using node with parameters.
Example:

```
cd bin & node cli get-datasets
```