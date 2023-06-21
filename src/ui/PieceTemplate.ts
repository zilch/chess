import { PieceSymbol } from "chess.js";
import { BotMaterial } from "./BotMaterial";
import { Mesh, Scene } from "@babylonjs/core";

interface PieceTemplateParams {
  scene: Scene;
  type: PieceSymbol;
  whiteBotMaterial: BotMaterial;
  blackBotMaterial: BotMaterial;
}

interface MeshTemplateNames {
  simplePiece: string;
  simplePieceOutline: string;
  pieceBlack: string | string[];
  pieceWhite: string | string[];
  pieceRing: string;
}

const meshTemplateNameMap: Record<PieceSymbol, MeshTemplateNames> = {
  q: {
    simplePiece: "QueenSimple",
    simplePieceOutline: "QueenSimpleOutline",
    pieceBlack: "QueenBlack",
    pieceWhite: "QueenWhite",
    pieceRing: "QueenRing",
  },
  k: {
    simplePiece: "KingSimple",
    simplePieceOutline: "KingSimpleOutline",
    pieceBlack: "KingBlack",
    pieceWhite: "KingWhite",
    pieceRing: "KingRing",
  },
  r: {
    simplePiece: "RookSimple",
    simplePieceOutline: "RookSimpleOutline",
    pieceBlack: "RookBlack",
    pieceWhite: "RookWhite",
    pieceRing: "RookRing",
  },
  p: {
    simplePiece: "PawnSimple",
    simplePieceOutline: "PawnSimpleOutline",
    pieceBlack: "PawnBlack",
    pieceWhite: "PawnWhite",
    pieceRing: "PawnRing",
  },
  n: {
    simplePiece: "KnightSimple",
    simplePieceOutline: "KnightSimpleOutline",
    pieceBlack: "KnightBlack",
    pieceWhite: "KnightWhite",
    pieceRing: "KnightRing",
  },
  b: {
    simplePiece: "BishopSimple",
    simplePieceOutline: "BishopSimpleOutline",
    pieceBlack: ["BishopBlack_primitive0", "BishopBlack_primitive1"],
    pieceWhite: ["BishopWhite_primitive0", "BishopWhite_primitive1"],
    pieceRing: "BishopRing",
  },
};

interface TemplateMeshByColor {
  b: Mesh;
  w: Mesh;
}

export class PieceTemplate {
  #scene: Scene;

  simplePiece: TemplateMeshByColor;
  simplePieceOutline: TemplateMeshByColor;

  piece: TemplateMeshByColor;
  pieceRing: TemplateMeshByColor;

  constructor(params: PieceTemplateParams) {
    this.#scene = params.scene;

    const names = meshTemplateNameMap[params.type];

    // Simple
    this.simplePiece = {
      w: this.#loadMesh(names.simplePiece).clone(),
      b: this.#loadMesh(names.simplePiece),
    };
    this.simplePiece.w.material = params.whiteBotMaterial.simple;
    this.simplePiece.b.material = params.blackBotMaterial.simple;

    // Simple Outline
    this.simplePieceOutline = {
      w: this.#loadMesh(names.simplePieceOutline).clone(),
      b: this.#loadMesh(names.simplePieceOutline),
    };
    this.simplePieceOutline.w.material = params.whiteBotMaterial.outline;
    this.simplePieceOutline.b.material = params.blackBotMaterial.outline;

    // Complex
    this.piece = {
      w: this.#loadMesh(names.pieceWhite),
      b: this.#loadMesh(names.pieceBlack),
    };

    // Complex Ring
    this.pieceRing = {
      w: this.#loadMesh(names.pieceRing).clone(),
      b: this.#loadMesh(names.pieceRing),
    };
    this.pieceRing.w.material = params.whiteBotMaterial.ring;
    this.pieceRing.b.material = params.blackBotMaterial.ring;
  }

  #loadMesh(name: string | string[]) {
    const mesh = Array.isArray(name)
      ? Mesh.MergeMeshes(name.map((n) => this.#getMesh(n)))!
      : this.#getMesh(name);
    mesh.isVisible = false;
    mesh.receiveShadows = true;
    return mesh;
  }

  #getMesh(name: string) {
    const mesh = this.#scene.getMeshByName(name);
    if (mesh instanceof Mesh) {
      return mesh;
    } else {
      throw new Error(`Unable to find mesh with name "${name}"`);
    }
  }
}
