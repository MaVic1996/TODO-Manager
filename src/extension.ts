// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { rgPath } from "@vscode/ripgrep";
import * as fs from "fs";

const files: any[] = [];
const todos = [];
const excludedDirs = [".git"];
const VALID_REGEX = /TODO [[a-zA-Z]+]/g;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "todo-manager" is now active!');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "todo-manager.findTODOS",
    () => {
      if (vscode.workspace.workspaceFolders) {
        vscode.workspace.workspaceFolders.map(
          (folder: vscode.WorkspaceFolder) => {
            if (folder.uri && folder.uri.scheme === "file") {
              recFind(folder.uri.fsPath);
              files.forEach((filepath) => {
                const doc = fs.readFileSync(filepath, { encoding: "utf-8" });
                doc.match(VALID_REGEX)?.forEach((match) => todos.push(match));
              });
            }
          }
        );
      }
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(`${todos.length} todos`);
    }
  );

  context.subscriptions.push(disposable);
}

function recFind(path: string) {
  fs.readdirSync(path, { withFileTypes: true }).forEach((dir) => {
    if (dir.isFile()) {
      files.push(`${path}\\${dir.name}`);
    } else if (dir.isDirectory() && !excludedDirs.includes(dir.name)) {
      recFind(`${path}\\${dir.name}`);
    }
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
