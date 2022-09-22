import * as vscode from "vscode";
import * as fs from "fs";

const files: any[] = [];
const excludedDirs = [".git"];
const VALID_REGEX = /TODO [[a-zA-Z]+]/g;

export const countTodo: () => any[] = () => {
  const todos: any[] = [];

  if (vscode.workspace.workspaceFolders) {
    vscode.workspace.workspaceFolders.map((folder: vscode.WorkspaceFolder) => {
      if (folder.uri && folder.uri.scheme === "file") {
        recFind(folder.uri.fsPath);
        files.forEach((filepath) => {
          const doc = fs.readFileSync(filepath, { encoding: "utf-8" });
          doc.match(VALID_REGEX)?.forEach((match) => todos.push(match));
        });
      }
    });
  }
  return todos;
};

const recFind = (path: string) => {
  fs.readdirSync(path, { withFileTypes: true }).forEach((dir) => {
    if (dir.isFile()) {
      files.push(`${path}\\${dir.name}`);
    } else if (dir.isDirectory() && !excludedDirs.includes(dir.name)) {
      recFind(`${path}\\${dir.name}`);
    }
  });
};
