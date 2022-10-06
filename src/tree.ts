import * as vscode from "vscode";

export class TreeNodeProvider implements vscode.TreeDataProvider<any> {
  constructor(private context: vscode.ExtensionContext) {}

  getTreeItem(element: any): vscode.TreeItem {
    return element;
  }

  getChildren(element?: any): Thenable<any[]> {
    return Promise.resolve([]);
  }

  getParent(element: any) {
    return element.parent;
  }

  dispose() {
    console.log("Disposed");
  }
}
