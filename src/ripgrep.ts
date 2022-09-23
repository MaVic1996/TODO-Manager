import { rgPath } from "@vscode/ripgrep";
import { spawnSync, SpawnSyncReturns } from "child_process";

// CONSTANTS
const END_LINE_SPLITTER = "\r\n";

// Path from node modules.
const rg = rgPath.replace("bin\\rg", "node_modules\\@vscode\\ripgrep\\bin\\rg");

export type MatchInfo = {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  lineLength: number;
  lineContent: string;
  todoTag: string;
};

export const ripGrep = (
  regex: string,
  path: string,
  options: string[] = []
) => {
  const matches = spawnSync(rg, [...options, "--column", regex, path]);
  const parsedMatches = getMatchesInfo(matches);
  return parsedMatches;
};

const getMatchesInfo: (matches: SpawnSyncReturns<Buffer>) => MatchInfo[] = (
  matches: SpawnSyncReturns<Buffer>
) => {
  if (matches.error) {
    return [];
  }
  return matches.stdout
    .toString()
    .split(END_LINE_SPLITTER)
    .filter((lineMatch: string) => lineMatch.length > 0)
    .map((lineMatch: string) => parseMatch(lineMatch));
};

const parseMatch: (match: string) => MatchInfo = (match: string) => {
  const splitted = match.split(":");

  return {
    filePath: `${splitted[0]}:${splitted[1]}`,
    lineNumber: Number(splitted[2]),
    columnNumber: Number(splitted[3]),
    lineLength: splitted[4].length,
    lineContent: splitted[4],
    todoTag: splitted[4].split("[")[1].replace("]", ""),
  };
};
