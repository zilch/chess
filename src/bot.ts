import { Chess } from "chess.js";
import type { CreateBotParams } from "zilch-game-engine";

Zilch.Bot = class {
  params: CreateBotParams;

  constructor(params: CreateBotParams) {
    this.params = params;
  }

  move(payload: string) {
    const possibleMoves = new Chess(payload).moves();

    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }
};
