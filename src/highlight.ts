import * as vscode from "vscode";
import { MatchInfo } from "./types/MatchInfo";

// Constants
const INTERVAL_TIME = 3_000;

// vscode properties
const workspace = vscode.workspace;
const window = vscode.window;

// Variables
let highlightInterval: NodeJS.Timer;

const highlightTodos = (context: vscode.ExtensionContext) => {
  const de = window.createTextEditorDecorationType({
    backgroundColor: "red",
  });
  const currentMatches = context.workspaceState.get("todos") as MatchInfo[];
  if (currentMatches.length === 0 || window.visibleTextEditors.length === 0)
    return;
  window.visibleTextEditors.forEach((editor) => {
    const filtered = currentMatches.filter(
      (match) => editor.document.fileName === match.filePath
    );

    const ranges = filtered.map(
      (filt: MatchInfo) =>
        new vscode.Range(
          editor.document.positionAt(filt.offset),
          editor.document.positionAt(filt.offset + filt.todoTag.length)
        )
    );
    editor.setDecorations(de, ranges);
  });
};
