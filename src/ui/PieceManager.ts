import {
  Mesh,
  Quaternion,
  Scene,
  Animation,
  ShadowGenerator,
  SineEase,
  TransformNode,
  Vector3,
  CubicEase,
} from "@babylonjs/core";
import { Color, PieceSymbol, Square } from "chess.js";
import { runAnimation } from "./utils";
import { getBoardTransitionSteps } from "./getBoardTransitionSteps";

const squareSize = 0.057888;
const boardHeight = 0.017393;

export class PieceManager {
  #scene: Scene;

  #wBishop: Mesh;
  #bBishop: Mesh;

  #wQueen: Mesh;
  #bQueen: Mesh;

  #wKing: Mesh;
  #bKing: Mesh;

  #wPawn: Mesh;
  #bPawn: Mesh;

  #wRook: Mesh;
  #bRook: Mesh;

  #wKnight: Mesh;
  #bKnight: Mesh;

  #fen: string | null = null;

  #pieces = new Map<string, Piece>();

  #shadowGenerators: ShadowGenerator[];

  #lastUpdate = 0;

  constructor(scene: Scene, shadowGenerators: ShadowGenerator[]) {
    this.#scene = scene;
    this.#shadowGenerators = shadowGenerators;

    const getMesh = (name: string) => {
      const mesh = scene.getMeshByName(name);
      if (mesh instanceof Mesh) {
        return mesh;
      } else {
        throw new Error("Unable to find mesh with name " + name);
      }
    };

    const whiteBishopPart1 = getMesh("WhiteBishop_primitive0");
    const whiteBishopPart2 = getMesh("WhiteBishop_primitive1");
    whiteBishopPart1.position.y = boardHeight;
    whiteBishopPart2.position.y = boardHeight;
    this.#wBishop = Mesh.MergeMeshes([whiteBishopPart1, whiteBishopPart2])!;
    this.#wBishop.isVisible = false;
    this.#wBishop.receiveShadows = true;

    const blackBishopPart1 = getMesh("BlackBishop_primitive0");
    const blackBishopPart2 = getMesh("BlackBishop_primitive1");
    blackBishopPart1.position.y = boardHeight;
    blackBishopPart2.position.y = boardHeight;
    this.#bBishop = Mesh.MergeMeshes([blackBishopPart1, blackBishopPart2])!;
    this.#bBishop.isVisible = false;
    this.#bBishop.receiveShadows = true;

    this.#wQueen = getMesh("WhiteQueen");
    this.#wQueen.isVisible = false;
    this.#wQueen.receiveShadows = true;

    this.#bQueen = getMesh("BlackQueen");
    this.#bQueen.isVisible = false;
    this.#bQueen.receiveShadows = true;

    this.#wKing = getMesh("WhiteKing");
    this.#wKing.isVisible = false;
    this.#wKing.receiveShadows = true;

    this.#bKing = getMesh("BlackKing");
    this.#bKing.isVisible = false;
    this.#bKing.receiveShadows = true;

    this.#wPawn = getMesh("WhitePawn");
    this.#wPawn.isVisible = false;
    this.#wPawn.receiveShadows = true;

    this.#bPawn = getMesh("BlackPawn");
    this.#bPawn.isVisible = false;
    this.#bPawn.receiveShadows = true;

    this.#wRook = getMesh("WhiteRook");
    this.#wRook.isVisible = false;
    this.#wRook.receiveShadows = true;

    this.#bRook = getMesh("BlackRook");
    this.#bRook.isVisible = false;
    this.#bRook.receiveShadows = true;

    this.#wKnight = getMesh("WhiteKnight");
    this.#wKnight.isVisible = false;
    this.#wKnight.receiveShadows = true;

    this.#bKnight = getMesh("BlackKnight");
    this.#bKnight.isVisible = false;
    this.#bKnight.receiveShadows = true;
  }

  #fastForwardAnimations() {
    for (const animatable of this.#scene.animatables) {
      animatable.goToFrame(animatable.toFrame);
      animatable.stop();
    }
  }

  update(fen: string) {
    const now = Date.now();
    const immediate = now - this.#lastUpdate < 500;
    this.#lastUpdate = now;

    if (immediate) {
      this.#fastForwardAnimations();
    }

    const { adds, removals, moves } = getBoardTransitionSteps(fen, this.#fen);
    this.#fen = fen;

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
      const mesh = {
        b: add.piece.color === "b" ? this.#bBishop : this.#wBishop,
        n: add.piece.color === "b" ? this.#bKnight : this.#wKnight,
        q: add.piece.color === "b" ? this.#bQueen : this.#wQueen,
        k: add.piece.color === "b" ? this.#bKing : this.#wKing,
        p: add.piece.color === "b" ? this.#bPawn : this.#wPawn,
        r: add.piece.color === "b" ? this.#bRook : this.#wRook,
      }[add.piece.type];
      pieces.set(
        add.piece.square,
        new Piece(add.piece, mesh, this.#shadowGenerators)
      );
    }

    this.#pieces = pieces;
  }
}

interface PieceProperties {
  color: Color;
  square: Square;
  type: PieceSymbol;
}

class Piece {
  #positionAnimateNode: TransformNode;
  #fallAnimateNode: TransformNode;
  #isBishop: boolean;

  constructor(
    properties: PieceProperties,
    mesh: Mesh,
    shadowGenerators: ShadowGenerator[]
  ) {
    this.#isBishop = properties.type === "b";
    const instance = mesh.createInstance(properties.color + properties.type);
    this.#positionAnimateNode = new TransformNode(
      properties + properties.type + "-position"
    );
    this.#fallAnimateNode = new TransformNode(
      properties + properties.type + "-fall"
    );
    this.#fallAnimateNode.parent = this.#positionAnimateNode;
    instance.parent = this.#fallAnimateNode;

    this.#positionAnimateNode.position = this.#getPosition(properties.square);

    shadowGenerators.forEach((shadowGenerator) => {
      shadowGenerator.addShadowCaster(instance);
    });
  }

  move(to: Square, immediate: boolean) {
    const targetPosition = this.#getPosition(to);

    const distanceX = targetPosition.x - this.#positionAnimateNode.position.x;
    const distanceZ = targetPosition.z - this.#positionAnimateNode.position.z;
    const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);

    const rotationFactor = 1.2 * distance;
    const rotationX = (rotationFactor * -distanceZ) / distance;
    const rotationZ = (rotationFactor * distanceX) / distance;

    const easingFunction = new SineEase();

    runAnimation(this.#positionAnimateNode, [
      {
        frames: {
          0: this.#positionAnimateNode.rotation.z,
          25: rotationZ,
          50: 0,
        },
        property: "rotation.z",
        easingFunction,
        immediate,
      },
      {
        frames: {
          0: this.#positionAnimateNode.rotation.x,
          25: rotationX,
          50: 0,
        },
        property: "rotation.x",
        easingFunction,
        immediate,
      },
      {
        frames: {
          5: this.#positionAnimateNode.position.z,
          45: targetPosition.z,
        },
        property: "position.z",
        easingFunction,
        immediate,
      },
      {
        frames: {
          0: this.#positionAnimateNode.position.y,
          25: targetPosition.y + 0.01 + 0.2 * distance,
          50: targetPosition.y,
        },
        property: "position.y",
        easingFunction,
        immediate,
      },
      {
        frames: {
          5: this.#positionAnimateNode.position.x,
          45: targetPosition.x,
        },
        property: "position.x",
        easingFunction,
        immediate,
      },
    ]);
  }

  dispose(reason: Square | "promoted" | undefined, immediate: boolean) {
    if (reason === "promoted" || !reason) {
      this.#positionAnimateNode.dispose();
      return;
    }

    if (typeof reason === "string") {
      const attackedFrom = this.#getPosition(reason);

      const distanceX = attackedFrom.x - this.#positionAnimateNode.position.x;
      const distanceZ = attackedFrom.z - this.#positionAnimateNode.position.z;

      const currentRotation =
        this.#fallAnimateNode.rotationQuaternion ?? Quaternion.Zero();
      const targetRotation =
        this.#fallAnimateNode
          .rotate(new Vector3(-distanceZ, 0, distanceX), Math.PI / 2)
          .rotationQuaternion?.clone() ?? Quaternion.Zero();

      this.#fallAnimateNode.rotationQuaternion = currentRotation;

      runAnimation(this.#fallAnimateNode, [
        {
          property: "rotationQuaternion",
          animationType: Animation.ANIMATIONTYPE_QUATERNION,
          frames: {
            0: currentRotation,
            40: targetRotation,
          },
          easingFunction: new CubicEase(),
          easingMode: "in",
          immediate,
        },
        {
          property: "scaling",
          animationType: Animation.ANIMATIONTYPE_VECTOR3,
          frames: {
            0: this.#fallAnimateNode.scaling,
            20: Vector3.One().scale(1.05),
            30: Vector3.One().scale(0.9),
            40: Vector3.One().scale(0.7),
          },
          easingFunction: new SineEase(),
          immediate,
        },
        {
          property: "position.y",
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          frames: {
            0: this.#fallAnimateNode.position.y,
            400: this.#fallAnimateNode.position.y - 0.03,
          },
          easingFunction: new CubicEase(),
          immediate,
        },
      ]).finally(() => {
        this.#positionAnimateNode.dispose();
      });
    }
  }

  #getPosition(square: Square) {
    const [file, rank] = square.split("");
    const rankIndex = "12345678".indexOf(rank);
    const fileIndex = "abcdefgh".indexOf(file);
    if (rankIndex === -1 || fileIndex === -1) {
      debugger;
    }
    const x = (rankIndex - 3.5) * -squareSize;
    const z = (fileIndex - 3.5) * squareSize;
    let y = boardHeight;
    if (this.#isBishop) {
      y -= 0.018;
    }
    return new Vector3(x, y, z);
  }
}
