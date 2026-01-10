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
* `baboon.modelDir`: Path to the Baboon model directory. The LSP server is started with `--model-dir <modelDir> :lsp`.

## Development

1.  Clone the repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm run compile` to build the extension.
4.  Press `F5` to start debugging.