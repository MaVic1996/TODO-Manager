import * as vscode from "vscode";
import { ripGrep } from "./ripgrep";
import { MatchInfo } from "./types/MatchInfo";

// Constants
const SUPPORTED_COMMENT_LINES = "(//|#)";
const VALID_REGEX = `${SUPPORTED_COMMENT_LINES} TODO \\[[a-zA-Z0-9]+\\].*`;
const INTERVAL_TIME = 3_000;

// vscode properties
const workspace = vscode.workspace;

// Variables
let searchInterval: NodeJS.Timer;

export const startSearch = (context: vscode.ExtensionContext) => {
  if (searchInterval) return;
  searchInterval = setInterval(() => searchTodos(context), INTERVAL_TIME);
};

const searchTodos = (context: vscode.ExtensionContext) => {
  workspace.workspaceFolders &&
    workspace.workspaceFolders.map((folder: vscode.WorkspaceFolder) => {
      if (!folder.uri || folder.uri.scheme !== "file") return;
      context.workspaceState.update(
        "todos",
        ripGrep(VALID_REGEX, folder.uri.fsPath)
      );
    });
};
