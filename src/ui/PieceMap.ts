import { Chess, Color, PieceSymbol, Square } from "chess.js";

export interface Piece {
  type: PieceSymbol;
  color: Color;
  square: Square;
}

export class PieceMap {
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

  getByTypeAndColor(piece: Omit<Piece, "square">) {
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

  #getTypeAndColorKey(piece: Omit<Piece, "square">) {
    return piece.type + piece.color;
  }
}
