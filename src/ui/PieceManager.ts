import { Mesh, MeshBuilder, Scene, ShadowGenerator } from "@babylonjs/core";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { getBoardTransitionSteps } from "./getBoardTransitionSteps";
import { BotMaterial } from "./BotMaterial";
import { PieceTemplate } from "./PieceTemplate";
import { AttackAnimation } from "./AttackAnimation";
import { SquareEmphasis } from "./SquareEmphasis";
import { Piece } from "./Piece";
import { ringDiameterMap } from "./utils";
import { PieceMap } from "./PieceMap";
import { AttackIndicator } from "./AttackIndicator";

export class PieceManager {
  #scene: Scene;

  #fen: string | null = null;

  #pieces = new Map<string, Piece>();

  #shadowGenerators: ShadowGenerator[];

  #lastUpdate = 0;

  #blackCurrentSquare: SquareEmphasis;
  #blackLastSquare: SquareEmphasis;

  #whiteCurrentSquare: SquareEmphasis;
  #whiteLastSquare: SquareEmphasis;

  #topView = false;

  #whiteBotMaterial: BotMaterial;
  #blackBotMaterial: BotMaterial;

  #blackPointerTemplate: Mesh;
  #whitePointerTemplate: Mesh;

  #pieceTemplateByType: Record<PieceSymbol, PieceTemplate>;

  #kingAttacks = new Map<string, AttackIndicator>();

  constructor(scene: Scene, shadowGenerators: ShadowGenerator[]) {
    this.#scene = scene;
    this.#shadowGenerators = shadowGenerators;

    this.#whiteCurrentSquare = new SquareEmphasis(true);
    this.#whiteLastSquare = new SquareEmphasis(false);

    this.#blackCurrentSquare = new SquareEmphasis(true);
    this.#blackLastSquare = new SquareEmphasis(false);

    this.#whiteBotMaterial = new BotMaterial(scene, "w", null);
    this.#blackBotMaterial = new BotMaterial(scene, "b", null);

    const setupPointerTemplate = (template: Mesh, botMaterial: BotMaterial) => {
      template.receiveShadows = true;
      template.isVisible = false;
      template.material = botMaterial.pointer;
    };
    this.#whitePointerTemplate = scene.getMeshByName("Pointer") as Mesh;
    this.#blackPointerTemplate = this.#whitePointerTemplate.clone();
    setupPointerTemplate(this.#whitePointerTemplate, this.#whiteBotMaterial);
    setupPointerTemplate(this.#blackPointerTemplate, this.#blackBotMaterial);

    const common = {
      blackBotMaterial: this.#blackBotMaterial,
      whiteBotMaterial: this.#whiteBotMaterial,
      scene,
    };

    const ringData: { id: PieceSymbol; name: string }[] = [
      { id: "b", name: "Bishop" },
      { id: "q", name: "Queen" },
      { id: "r", name: "Rook" },
      { id: "k", name: "King" },
      { id: "p", name: "Pawn" },
      { id: "n", name: "Knight" },
    ];

    for (const ring of ringData) {
      const diameter = ringDiameterMap[ring.id];
      const height = 0.002;
      const mesh = MeshBuilder.CreateCylinder(ring.name + "Ring", {
        diameter: diameter + 0.002,
        height,
        tessellation: 20,
      });
      mesh.position.y = height / 2 + 0.001;
      mesh.isVisible = false;
    }

    this.#pieceTemplateByType = {
      b: new PieceTemplate({ type: "b", ...common }),
      k: new PieceTemplate({ type: "k", ...common }),
      p: new PieceTemplate({ type: "p", ...common }),
      r: new PieceTemplate({ type: "r", ...common }),
      n: new PieceTemplate({ type: "n", ...common }),
      q: new PieceTemplate({ type: "q", ...common }),
    };
  }

  #fastForwardAnimations() {
    for (const animatable of this.#scene.animatables) {
      if (
        animatable.target.name !== "SideViewNode" &&
        animatable.target.name !== "TopViewNode" &&
        animatable.target.name !== "AttackAnimation"
      ) {
        animatable.goToFrame(animatable.toFrame);
        animatable.stop();
      }
    }
  }

  update(
    fen: string,
    whiteColor: string | null,
    blackColor: string | null,
    topView: boolean
  ) {
    let immediate = false;

    if (this.#fen !== fen) {
      const now = Date.now();
      immediate = now - this.#lastUpdate < 500;
      this.#lastUpdate = now;
    }

    if (immediate) {
      this.#fastForwardAnimations();
    }

    this.#blackBotMaterial.update(blackColor, immediate);
    this.#whiteBotMaterial.update(whiteColor, immediate);

    if (fen !== this.#fen) {
      const { adds, removals, moves, toChess, fromChess } =
        getBoardTransitionSteps(fen, this.#fen);
      this.#fen = fen;

      let kingAttacks = new Map<
        string,
        { from: Square; to: Square; color: string }
      >();

      if (toChess.isCheck()) {
        const king = getKing(toChess, toChess.turn());
        kingAttacks = new Map(
          getAttackers(toChess.fen(), king.square).map((from) => {
            const to = king.square;
            const color =
              (toChess.turn() === "w" ? blackColor : whiteColor) ?? "#666";
            return [AttackIndicator.key(from, to, color), { from, to, color }];
          })
        );
      }

      // Remove attack that are in both
      kingAttacks.forEach((_, key) => {
        if (this.#kingAttacks.has(key)) {
          kingAttacks.delete(key);
        }
      });

      // Dispose attacks only in old
      this.#kingAttacks.forEach((attack, key) => {
        if (!kingAttacks.has(key)) {
          this.#kingAttacks.delete(key);
          attack.dispose(immediate);
        }
      });

      // Add new attacks
      kingAttacks.forEach((attack, key) => {
        this.#kingAttacks.set(
          key,
          new AttackIndicator(
            attack.from,
            attack.to,
            toChess.turn() === "b"
              ? this.#blackPointerTemplate
              : this.#whitePointerTemplate,
            !toChess.isCheckmate() && immediate
          )
        );
      });

      if (
        (moves.length === 1 && adds.length <= 1 && removals.length <= 1) ||
        (moves.length === 0 && adds.length === 1 && removals.length === 1)
      ) {
        const move = (chess: Chess | null) =>
          (chess?.moveNumber() ?? 0) + (chess?.turn() === "b" ? 0.5 : 0);
        const forward = move(toChess) > move(fromChess);
        const chess = toChess;

        const currentSquare =
          chess?.turn() === "w"
            ? this.#whiteCurrentSquare
            : this.#blackCurrentSquare;
        const lastSquare =
          chess?.turn() === "w" ? this.#whiteLastSquare : this.#blackLastSquare;
        const otherCurrentSquare =
          chess?.turn() === "b"
            ? this.#whiteCurrentSquare
            : this.#blackCurrentSquare;
        const otherLastSquare =
          chess?.turn() === "b" ? this.#whiteLastSquare : this.#blackLastSquare;

        const color =
          chess?.turn() === (forward ? "b" : "w") ? whiteColor : blackColor;
        const otherColor =
          chess?.turn() === (forward ? "w" : "b") ? whiteColor : blackColor;

        otherCurrentSquare.update(null, null, otherColor, immediate);
        otherLastSquare.update(null, null, otherColor, immediate);

        if (moves.length === 1) {
          if (forward && removals.length > 0 && !immediate) {
            new AttackAnimation(moves[0].to, color, 2);
            new AttackAnimation(moves[0].to, color, 6);
          }
          currentSquare.update(
            moves[0].to,
            chess?.get(moves[0].to).type ?? null,
            color,
            immediate
          );
          lastSquare.update(moves[0].from, null, color, immediate);
        } else {
          currentSquare.update(
            adds[0].piece.square,
            chess?.get(adds[0].piece.square).type ?? null,
            color,
            immediate
          );
          lastSquare.update(removals[0].square, null, color, immediate);
        }
      } else {
        this.#whiteLastSquare.update(null, null, whiteColor, immediate);
        this.#whiteCurrentSquare.update(null, null, whiteColor, immediate);
        this.#blackLastSquare.update(null, null, blackColor, immediate);
        this.#blackCurrentSquare.update(null, null, blackColor, immediate);
      }

      const pieces = new Map(this.#pieces);

      for (const removal of removals) {
        const piece = pieces.get(removal.square);
        piece?.dispose(removal.removalReason, immediate);
        pieces.delete(removal.square);
      }

      const moveFromSquaresToDelete = new Set<Square>();
      const moveToSquaresToAdd = new Map<Square, Piece>();

      for (const move of moves) {
        const piece = pieces.get(move.from);
        if (piece) {
          piece.move(move.to, immediate);
          moveFromSquaresToDelete.add(move.from);
          moveFromSquaresToDelete.delete(move.to);
          moveToSquaresToAdd.set(move.to, piece);
        }
      }

      for (const square of moveFromSquaresToDelete) {
        pieces.delete(square);
      }

      for (const [square, piece] of moveToSquaresToAdd) {
        pieces.set(square, piece);
      }

      for (const add of adds) {
        pieces.set(
          add.piece.square,
          new Piece({
            immediate,
            topView: this.#topView,
            shadowGenerators: this.#shadowGenerators,
            color: add.piece.color,
            square: add.piece.square,
            template: this.#pieceTemplateByType[add.piece.type],
          })
        );
      }
      this.#pieces = pieces;
    }

    if (this.#topView !== topView) {
      this.#topView = topView;
      this.#pieces.forEach((piece) => {
        piece.updateTopView(topView);
      });
    }
  }
}

function getKing(chess: Chess, color: Color) {
  const pieces = new PieceMap(chess.fen());

  const kings = Array.from(
    pieces.getByTypeAndColor({
      type: "k",
      color,
    })
  );

  if (kings.length !== 1) {
    // This probably should never happen
    throw new Error("Expected exactly one king on the board.");
  }

  return kings[0];
}

function getAttackers(fen: string, square: Square) {
  const [board, turn, ...rest] = fen.split(" ");
  const chess = new Chess([board, turn === "w" ? "b" : "w", ...rest].join(" "));

  const squareColor: Color | null = chess.get(square)?.color ?? null;
  const attackers: Square[] = [];

  for (const piece of chess.board().flat()) {
    if (!piece || !squareColor || squareColor === piece.color) {
      continue;
    }

    if (
      chess
        .moves({ verbose: true, square: piece.square })
        .some((move) => move.to === square)
    ) {
      attackers.push(piece.square);
    }
  }

  return attackers;
}
