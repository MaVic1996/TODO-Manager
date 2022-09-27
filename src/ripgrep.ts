import { rgPath } from "@vscode/ripgrep";
import { spawnSync, SpawnSyncReturns } from "child_process";
import { MatchInfo } from "./types/MatchInfo.d";

// CONSTANTS
const END_LINE_SPLITTER = "\n";

// Path from node modules.
const rg = rgPath
  .replace("bin\\rg", "node_modules\\@vscode\\ripgrep\\bin\\rg")
  .replace("bin/rg", "node_modules/@vscode/ripgrep/bin/rg");

export const ripGrep = (
  regex: string,
  path: string,
  options: string[] = []
) => {
  const matches = spawnSync(rg, [...options, "-b", "--column", regex, path]);
  const parsedMatches = getMatchesInfo(matches);
  return parsedMatches;
};

const getMatchesInfo: (matches: SpawnSyncReturns<Buffer>) => MatchInfo[] = (
  matches: SpawnSyncReturns<Buffer>
) => {
  if (matches.error) return [];
  return matches.stdout
    .toString()
    .replace("\r", "")
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
    offset: Number(splitted[4]) + splitted[5].indexOf("[") + 1,
    lineLength: splitted[5].length,
    lineContent: splitted[5],
    todoTag: splitted[5].split("[")[1].split("]")[0],
  };
};
