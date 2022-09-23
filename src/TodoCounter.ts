import * as vscode from "vscode";
import { MatchInfo, ripGrep } from "./ripgrep";

const files: any[] = [];
const excludedDirs = [".git"];
const SUPPORTED_COMMENT_LINES = "[//, #]";
const VALID_REGEX = `${SUPPORTED_COMMENT_LINES} TODO \\[[a-zA-Z]+\\]`;
export const countTodo: () => any[] = () => {
  let todos: MatchInfo[] = [];
  if (vscode.workspace.workspaceFolders) {
    vscode.workspace.workspaceFolders.map((folder: vscode.WorkspaceFolder) => {
      if (folder.uri && folder.uri.scheme === "file") {
        todos = ripGrep(VALID_REGEX, folder.uri.fsPath);
      }
    });
  }
  return todos;
};
