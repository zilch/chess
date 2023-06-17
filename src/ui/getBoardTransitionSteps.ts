import { Chess, PieceSymbol, Color, Square, Move } from "chess.js";

interface Piece {
  type: PieceSymbol;
  color: Color;
  square: Square;
}

interface AddTransitionStep {
  piece: Piece;
}

interface RemoveTransitionStep {
  square: Square;
  removalReason?: Square | "promoted";
}

interface MoveTransitionStep {
  from: Square;
  to: Square;
}

export function getBoardTransitionSteps(
  toFen: string,
  fromFen: string | null
): {
  removals: RemoveTransitionStep[];
  adds: AddTransitionStep[];
  moves: MoveTransitionStep[];
} {
  const toPieceMap = new PieceMap(toFen);
  const fromPieceMap = new PieceMap(fromFen);

  const toChess = new Chess(toFen);
  const fromChess = fromFen ? new Chess(fromFen) : null;

  const isMoveLegal = (fromPiece: Piece, toPiece: Piece) => {
    try {
      fromChess?.move({ from: fromPiece.square, to: toPiece.square });
      fromChess?.undo();
      return true;
    } catch {}

    try {
      toChess?.move({ from: toPiece.square, to: fromPiece.square });
      toChess?.undo();
      return true;
    } catch {}

    return false;
  };

  // Remove pieces that are the same between boards
  for (const toPiece of toPieceMap.values()) {
    const fromPiece = fromPieceMap.getBySquare(toPiece.square);

    if (
      fromPiece?.color === toPiece.color &&
      fromPiece.square === toPiece.square &&
      fromPiece.type === toPiece.type
    ) {
      toPieceMap.delete(toPiece);
      fromPieceMap.delete(fromPiece);
    }
  }

  // Determine pieces that can move positions
  const moves: MoveTransitionStep[] = [];
  for (const toPiece of toPieceMap.values()) {
    for (const fromPiece of fromPieceMap.getByTypeAndColor(toPiece).values()) {
      if (isMoveLegal(fromPiece, toPiece)) {
        toPieceMap.delete(toPiece);
        fromPieceMap.delete(fromPiece);
        moves.push({
          from: fromPiece.square,
          to: toPiece.square,
        });
        break;
      }
    }
  }

  // Create add transition steps for remaining "to pieces"
  const adds: AddTransitionStep[] = [];
  for (const toPiece of toPieceMap.values()) {
    adds.push({
      piece: toPiece,
    });
  }

  // Create remove transitions steps for remaining "from pieces"
  const isPromoted = ({ type, color, square }: Piece) => {
    if (type !== "p") {
      return false;
    }

    const [file, rank] = square.split("");
    const secondToLastRank = color === "b" ? "2" : "7";

    if (rank !== secondToLastRank) {
      return false;
    }

    const lastRank = color === "b" ? "2" : "7";
    return !!adds.find((add) => add.piece.square === file + lastRank);
  };
  const removals: RemoveTransitionStep[] = [];
  for (const fromPiece of fromPieceMap.values()) {
    const removalReason =
      moves.find((move) => move.to === fromPiece.square)?.from ??
      (isPromoted(fromPiece) ? "promoted" : undefined);

    removals.push({
      square: fromPiece.square,
      removalReason,
    });
  }

  return { adds, moves, removals };
}

class PieceMap {
  #bySquare = new Map<string, Piece>();
  #byTypeAndColor = new Map<string, Set<Piece>>();

  constructor(fen: string | null) {
    if (!fen) {
      return;
    }

    const chess = new Chess(fen);

    for (const piece of chess.board().flat()) {
      if (!piece) {
        continue;
      }

      this.#bySquare.set(piece.square, piece);

      const typeAndColorKey = this.#getTypeAndColorKey(piece);
      const byTypeAndColor =
        this.#byTypeAndColor.get(typeAndColorKey) ?? new Set();
      byTypeAndColor.add({ ...piece });
      this.#byTypeAndColor.set(typeAndColorKey, byTypeAndColor);
    }
  }

  getBySquare(square: string) {
    return this.#bySquare.get(square);
  }

  getByTypeAndColor(piece: Piece) {
    const typeAndColorKey = this.#getTypeAndColorKey(piece);
    return this.#byTypeAndColor.get(typeAndColorKey) ?? new Set();
  }

  delete(piece: Piece) {
    const typeAndColorKey = this.#getTypeAndColorKey(piece);
    const byTypeAndColor =
      this.#byTypeAndColor.get(typeAndColorKey) ?? new Set();
    for (const sameTypeAndColorPiece of byTypeAndColor) {
      if (sameTypeAndColorPiece.square === piece.square) {
        byTypeAndColor.delete(sameTypeAndColorPiece);
      }
    }
    if (byTypeAndColor.size === 0) {
      this.#byTypeAndColor.delete(typeAndColorKey);
    }

    this.#bySquare.delete(piece.square);
  }

  values() {
    return this.#bySquare.values();
  }

  #getTypeAndColorKey(piece: Piece) {
    return piece.type + piece.color;
  }
}
