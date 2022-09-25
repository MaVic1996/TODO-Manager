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
  highlightInterval = setInterval(() => highlightTodos(context));
};

const highlightTodos = (context: vscode.ExtensionContext) => {
  (context.workspaceState.get("todos") as MatchInfo[]).forEach(
    (info: MatchInfo) => {
      console.log(window.activeTextEditor);
      vscode.window.visibleTextEditors.forEach((editor) => {
        const matches = (
          context.workspaceState.get("todos") as MatchInfo[]
        ).filter((element) => element.filePath === editor.document.fileName);
        console.log(matches);
        const de = window.createTextEditorDecorationType({
          backgroundColor: "red",
        });
        matches.forEach((currentMatch) => {
          const match = new RegExp(currentMatch.todoTag).exec(
            editor.document.getText()
          );
          match &&
            editor.setDecorations(de, [
              new vscode.Range(
                editor.document.positionAt(match.index),
                editor.document.positionAt(
                  match.index + currentMatch.todoTag.length
                )
              ),
            ]);
        });
      });
    }
  );
};
