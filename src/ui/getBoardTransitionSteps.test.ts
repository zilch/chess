import { describe, expect, test } from "vitest";
import { getBoardTransitionSteps } from "./getBoardTransitionSteps";
import { Chess } from "chess.js";

describe("getBoardTransitionSteps", () => {
  test("it should return 32 adds on setup", () => {
    const chess = new Chess();
    const transitionSteps = getBoardTransitionSteps(chess.fen(), null);

    expect(transitionSteps.removals.length).toBe(0);
    expect(transitionSteps.moves.length).toBe(0);
    expect(transitionSteps.adds.length).toBe(32);
  });

  test("it should calculate initial pawn move properly", () => {
    const chess = new Chess();
    const fromFen = chess.fen();
    chess.move({ from: "d2", to: "d4" });
    const transitionSteps = getBoardTransitionSteps(chess.fen(), fromFen);

    expect(transitionSteps.removals.length).toBe(0);
    expect(transitionSteps.adds.length).toBe(0);
    expect(transitionSteps.moves).toEqual([{ from: "d2", to: "d4" }]);
  });

  test("it should calculate capture properly", () => {
    const chess = new Chess();
    chess.move({ from: "d2", to: "d4" });
    chess.move({ from: "e7", to: "e5" });
    const fromFen = chess.fen();
    chess.move({ from: "d4", to: "e5" });
    const transitionSteps = getBoardTransitionSteps(chess.fen(), fromFen);

    expect(transitionSteps.adds.length).toBe(0);
    expect(transitionSteps.removals).toEqual([
      { square: "e5", removalReason: "d4" },
    ]);
    expect(transitionSteps.moves).toEqual([{ from: "d4", to: "e5" }]);
  });
});
