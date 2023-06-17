import { Chess } from "chess.js";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { ZilchNamespace } from "zilch-game-engine";

/**
 * User facing config schema
 */
type RawConfig = FromSchema<typeof configSchema>;

export interface Config {
  fen: string;
}

export type State = string;

declare global {
  const Zilch: ZilchNamespace<RawConfig, Config, State>;
}

export const standardStartingPosition =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Schema for the JSON users can input as part of
 * game setup.
 */
const configSchema = {
  type: "object",
  properties: {
    pgn: {
      description: "Game in PGN format.",
      type: "string",
    },
    fen: {
      description: "Game in FEN format.",
      type: "string",
    },
  },
} as const satisfies JSONSchema;
Zilch.configSchema = configSchema;

Zilch.configPresets = [
  {
    name: "Standard",
    value: `{\n` + `  "fen": "${standardStartingPosition}"\n` + `}\n`,
  },
];

Zilch.parseConfig = (rawConfig) => {
  const chess = new Chess();
  if (rawConfig.pgn && rawConfig.fen) {
    throw new Error("Specify either PGN or FEN but not both.");
  }

  if (rawConfig.pgn) {
    chess.loadPgn(rawConfig.pgn);
  } else if (rawConfig.fen) {
    chess.load(rawConfig.fen);
  }

  return {
    fen: chess.fen(),
  };
};

Zilch.serializeConfig = (config) => {
  return config.fen;
};

Zilch.summarizeConfig = (config) => {
  if (
    config.fen === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  ) {
    return "standard starting position";
  } else {
    return "custom starting position";
  }
};
