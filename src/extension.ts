import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  Executable
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;
let outputChannel: vscode.OutputChannel;

function substituteVariables(value: string): string {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (workspaceFolder) {
    return value.replace(/\$\{workspaceFolder\}/g, workspaceFolder);
  }
  return value;
}

async function startClient(): Promise<void> {
  const config = vscode.workspace.getConfiguration('baboon');
  const rawServerPath = config.get<string>('serverPath') || 'baboon';
  const rawModelDirs = config.get<string[]>('modelDirs') || [];
  const rawServerOptions = config.get<string[]>('serverOptions') || [];
  const rawServerArgsOverride = config.get<string[]>('serverArgsOverride') || [];

  const serverPath = substituteVariables(rawServerPath);
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  let serverArgs: string[];
  if (rawServerArgsOverride.length > 0) {
    serverArgs = rawServerArgsOverride.map(substituteVariables);
  } else {
    const serverOptions = rawServerOptions.map(substituteVariables);
    const modelDirs = rawModelDirs.length > 0
      ? rawModelDirs.map(substituteVariables)
      : (workspaceFolder ? [workspaceFolder] : []);
    serverArgs = [...serverOptions, ...modelDirs.flatMap(dir => ['--model-dir', dir]), ':lsp'];
  }

  outputChannel.appendLine(`Server Path: ${serverPath}`);
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

  await client.start();
  outputChannel.appendLine("Baboon LSP client started.");
}

async function stopClient(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}

async function restartClient(): Promise<void> {
  outputChannel.appendLine("Restarting Baboon LSP...");
  try {
    await stopClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    outputChannel.appendLine(`Failed to stop client during restart: ${message}`);
    // Ensure client is cleared if stop failed, so we can try creating a new one
    client = undefined;
  }
  await startClient();
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Baboon LSP");
  outputChannel.appendLine("Baboon LSP extension activating...");

  const restartCommand = vscode.commands.registerCommand('baboon.restartLsp', async () => {
    try {
      await restartClient();
      vscode.window.showInformationMessage('Baboon LSP restarted.');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      outputChannel.appendLine(`Failed to restart Baboon LSP: ${message}`);
      vscode.window.showErrorMessage(`Failed to restart Baboon LSP: ${message}`);
    }
  });

  context.subscriptions.push(restartCommand);

  startClient().catch(err => {
    const message = err instanceof Error ? err.message : String(err);
    outputChannel.appendLine(`Baboon LSP client failed to start: ${message}`);
  });
}

export function deactivate(): Thenable<void> | undefined {
  return stopClient();
}
