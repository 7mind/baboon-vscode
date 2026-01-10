import * as path from 'path';
import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  Executable
} from 'vscode-languageclient/node';

let client: LanguageClient;

function substituteVariables(value: string): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (workspaceFolder) {
    return value.replace(/\$\{workspaceFolder\}/g, workspaceFolder);
  }
  return value;
}

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Baboon LSP");
  outputChannel.appendLine("Baboon LSP extension activating...");

  const config = vscode.workspace.getConfiguration('baboon');
  const rawServerPath = config.get<string>('serverPath') || 'baboon';
  const rawModelDir = config.get<string>('modelDir') || '';

  const serverPath = substituteVariables(rawServerPath);
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const modelDir = rawModelDir ? substituteVariables(rawModelDir) : workspaceFolder;
  const serverArgs = modelDir ? ['--model-dir', modelDir, ':lsp'] : [':lsp'];

  outputChannel.appendLine(`Server Path: ${serverPath}`);
  outputChannel.appendLine(`Model Dir: ${modelDir}`);
  outputChannel.appendLine(`Server Args: ${serverArgs.join(' ')}`);

  const run: Executable = {
      command: serverPath,
      args: serverArgs,
      options: {
          env: { ...process.env }
      }
  };

  const serverOptions: ServerOptions = {
    run,
    debug: run
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'baboon' }],
    outputChannel: outputChannel
  };

  client = new LanguageClient(
    'baboonLsp',
    'Baboon LSP',
    serverOptions,
    clientOptions
  );

  client.start().then(() => {
    outputChannel.appendLine("Baboon LSP client started.");
  }).catch(err => {
    outputChannel.appendLine(`Baboon LSP client failed to start: ${err}`);
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
