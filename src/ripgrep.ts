import { rgPath } from "@vscode/ripgrep";
import { spawnSync, SpawnSyncReturns } from "child_process";
import { platform } from "os";
import { resolve } from "path";
import { MatchInfo } from "./types/MatchInfo.d";

// CONSTANTS
const END_LINE_SPLITTER = "\n";

// Path from node modules.
const rg = () => {
  const base = resolve();
  if (platform() === "win32")
    return rgPath.replace(
      "bin\\rg",
      "node_modules\\vscode-ripgrep\\bin\\rg.exe"
    );

  return rgPath.replace("bin/rg", "node_modules/@vscode/ripgrep/bin/rg");
};

export const ripGrep = (
  regex: string,
  path: string,
  options: string[] = []
) => {
  const matches = spawnSync(rg(), [...options, "-b", "--column", regex, path]);
  const parsedMatches = getMatchesInfo(matches);
  return parsedMatches;
};

const getMatchesInfo: (matches: SpawnSyncReturns<Buffer>) => MatchInfo[] = (
  matches: SpawnSyncReturns<Buffer>
) => {
  if (matches.error) return [];
  return matches.stdout
    .toString()
    .replace("\\r", "")
    .split(END_LINE_SPLITTER)
    .filter((lineMatch: string) => lineMatch.length > 0)
    .map((lineMatch: string) => parseMatch(lineMatch));
};

const parseMatch: (match: string) => MatchInfo = (match: string) => {
  let splitted = match.split(":");
  if (platform() === "win32")
    splitted = [`${splitted[0]}:${splitted[1]}`, ...splitted.slice(2)];

  return {
    filePath: splitted[0],
    lineNumber: Number(splitted[1]),
    columnNumber: Number(splitted[2]),
    offset: Number(splitted[3]) + splitted[4].indexOf("[") + 1,
    lineLength: splitted[4].length,
    lineContent: splitted[4],
    todoTag: splitted[4].split("[")[1].split("]")[0],
  };
};
