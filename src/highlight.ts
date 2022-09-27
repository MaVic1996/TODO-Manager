import * as vscode from "vscode";
import { MatchInfo } from "./types/MatchInfo";

// Constants
const INTERVAL_TIME = 3_000;

// vscode properties
const workspace = vscode.workspace;
const window = vscode.window;

// Variables
let highlightInterval: NodeJS.Timer;

export const startHighlight = (context: vscode.ExtensionContext) => {
  if (highlightInterval) return;
  highlightInterval = setInterval(() => highlightTodos(context), INTERVAL_TIME);
};

const highlightTodos = (context: vscode.ExtensionContext) => {
  console.log(window.visibleTextEditors);
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
    filtered.forEach((filt: MatchInfo) => {
      editor.setDecorations({ ...de }, [
        new vscode.Range(
          editor.document.positionAt(filt.offset),
          editor.document.positionAt(filt.offset + filt.todoTag.length)
        ),
      ]);
    });
  });
  // vscode.window.visibleTextEditors.forEach((editor) => {
  //   const matches = (
  //     context.workspaceState.get("todos") as MatchInfo[]
  //   ).filter((element) => element.filePath === editor.document.fileName);
  //   console.log(matches);
  //   const de = window.createTextEditorDecorationType({
  //     backgroundColor: "red",
  //   });
  //   matches.forEach((currentMatch) => {
  //     const match = new RegExp(currentMatch.todoTag).exec(
  //       editor.document.getText()
  //     );
  //     match &&
  //       editor.setDecorations(de, [
  //         new vscode.Range(
  //           editor.document.positionAt(match.index),
  //           editor.document.positionAt(
  //             match.index + currentMatch.todoTag.length
  //           )
  //         ),
  //       ]);
  //   });
  // });
};
