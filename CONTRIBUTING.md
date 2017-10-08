# Contributing

## Setup

Clone the repository:
```
git clone https://github.com/Microsoft/PowerBI-Cli.git powerbi-cli
```

Navigate to the cloned directory

Install dependencies and dev-dependencies.
```
npm i
```

## Build:

```
npm run prepublish
```

## Install CLI from local repository:

In root git repository directory:

```
npm i -g
```

## Running the CLI without installation

Navigate to `/bin` directory and run cli file using node.

```
cd bin & node cli
```

### Running specific command:

Navigate to `/bin` directory and run specific cli file using node.
Example:

```
cd bin & node cli-get-datasets -c <collection> -w <workspace> -k <accessKey>
```

## Debug in Visual Studio Code

1) Change .vscode\launch.json file:
    1.1) Set in program the command you want to debug.
    1.2) Set in args the arguments for this command.
2) Run (Ctrl + F5)
