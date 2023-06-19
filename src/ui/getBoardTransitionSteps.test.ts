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

  test("it should handle promotions correctly", () => {
    const chess = new Chess("8/PK5k/8/8/8/8/5p2/8 w - - 0 1");
    const fromFenWhite = chess.fen();
    chess.move({ from: "a7", to: "a8", promotion: "q" });
    const transitionStepsWhite = getBoardTransitionSteps(
      chess.fen(),
      fromFenWhite
    );

    expect(transitionStepsWhite.moves.length).toBe(0);
    expect(transitionStepsWhite.adds).toEqual([
      { piece: { type: "q", color: "w", square: "a8" } },
    ]);
    expect(transitionStepsWhite.removals).toEqual([
      { square: "a7", removalReason: "promoted" },
    ]);

    const fromFenBlack = chess.fen();
    chess.move({ from: "f2", to: "f1", promotion: "q" });
    const transitionStepsBlack = getBoardTransitionSteps(
      chess.fen(),
      fromFenBlack
    );

    expect(transitionStepsBlack.moves.length).toBe(0);
    expect(transitionStepsBlack.adds).toEqual([
      { piece: { type: "q", color: "b", square: "f1" } },
    ]);
    expect(transitionStepsBlack.removals).toEqual([
      { square: "f2", removalReason: "promoted" },
    ]);
  });
});
