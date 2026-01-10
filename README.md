# Baboon DML

VS Code extension for [Baboon DML](https://github.com/7mind/baboon).

## Features

- Syntax highlighting for `.baboon` files.
- Language Server Protocol (LSP) support (requires Baboon compiler).

## Requirements

To use the LSP features (diagnostics, navigation, etc.), you need the Baboon compiler executable installed or built locally.

## Configuration

This extension provides the following configuration settings:

* `baboon.serverPath`: Path to the Baboon compiler executable. Defaults to `baboon`.
* `baboon.modelDirs`: Paths to Baboon model directories. Defaults to the workspace folder if empty.
* `baboon.serverOptions`: Additional options prepended to server arguments.
* `baboon.serverArgsOverride`: Fully override server arguments (ignores `modelDirs` and `serverOptions` when set).

By default, the LSP server is started with `[...serverOptions] --model-dir <dir1> --model-dir <dir2> ... :lsp`.

## Commands

* `Baboon: Restart LSP Server` - Restart the Baboon LSP server. Useful when the server crashes or after changing configuration.

## Development

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm run compile` to build the extension.
4.  Press `F5` to start debugging.