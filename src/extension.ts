// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { startHighlight } from "./highlight";
import { startSearch } from "./searchCount";
import { MatchInfo } from "./types/MatchInfo";
import { TreeNodeProvider } from "./tree";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "todo-manager" is now active!');
  startSearch(context);
  const provider = new TreeNodeProvider(context);
  const view = vscode.window.createTreeView("todoManager", {
    showCollapseAll: true,
    treeDataProvider: provider,
  });
  context.subscriptions.push(view);
  context.subscriptions.push(provider);
  view.reveal(null, {});
  // startHighlight(context);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "todo-manager.findTODOS",
    () => {
      vscode.window.activeTextEditor;
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const todos = context.workspaceState.get("todos") as MatchInfo[];
      vscode.window.showInformationMessage(`TODOS: ${todos.length}`);
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
