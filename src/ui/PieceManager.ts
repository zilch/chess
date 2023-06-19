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
  BackEase,
  MeshBuilder,
  Material,
  StandardMaterial,
  InstancedMesh,
} from "@babylonjs/core";
import { Color, PieceSymbol, Square } from "chess.js";
import { AnimationData, runAnimation, toBabylonColor } from "./utils";
import { getBoardTransitionSteps } from "./getBoardTransitionSteps";
import * as csx from "csx";

const squareSize = 0.057888;
const boardHeight = 0.017393;
const fallbackColor = "#070707";

export class PieceManager {
  #scene: Scene;

  #wBishop: Mesh;
  #bBishop: Mesh;
  #wBishopRing: Mesh;
  #bBishopRing: Mesh;

  #wQueen: Mesh;
  #bQueen: Mesh;
  #wQueenRing: Mesh;
  #bQueenRing: Mesh;

  #wKing: Mesh;
  #bKing: Mesh;
  #wKingRing: Mesh;
  #bKingRing: Mesh;

  #wPawn: Mesh;
  #bPawn: Mesh;
  #wPawnRing: Mesh;
  #bPawnRing: Mesh;

  #wRook: Mesh;
  #bRook: Mesh;
  #wRookRing: Mesh;
  #bRookRing: Mesh;

  #wKnight: Mesh;
  #bKnight: Mesh;
  #wKnightRing: Mesh;
  #bKnightRing: Mesh;

  #whiteRingMaterial: StandardMaterial;
  #blackRingMaterial: StandardMaterial;

  #fen: string | null = null;

  #pieces = new Map<string, Piece>();

  #shadowGenerators: ShadowGenerator[];

  #lastUpdate = 0;

  #blackColor: string | null = null;
  #whiteColor: string | null = null;

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

    this.#whiteRingMaterial = new StandardMaterial("white-ring");
    this.#updateRingColor(this.#whiteRingMaterial, null, true);
    this.#blackRingMaterial = new StandardMaterial("black-ring");
    this.#updateRingColor(this.#blackRingMaterial, null, true);

    const whiteBishopPart1 = getMesh("WhiteBishop_primitive0");
    const whiteBishopPart2 = getMesh("WhiteBishop_primitive1");
    this.#wBishop = Mesh.MergeMeshes([whiteBishopPart1, whiteBishopPart2])!;
    this.#wBishop.isVisible = false;
    this.#wBishop.receiveShadows = true;
    this.#wBishopRing = this.#createRing(this.#whiteRingMaterial, "b", "w");

    const blackBishopPart1 = getMesh("BlackBishop_primitive0");
    const blackBishopPart2 = getMesh("BlackBishop_primitive1");
    this.#bBishop = Mesh.MergeMeshes([blackBishopPart1, blackBishopPart2])!;
    this.#bBishop.isVisible = false;
    this.#bBishop.receiveShadows = true;
    this.#bBishopRing = this.#createRing(this.#blackRingMaterial, "b", "b");

    this.#wQueen = getMesh("WhiteQueen");
    this.#wQueen.isVisible = false;
    this.#wQueen.receiveShadows = true;
    this.#wQueenRing = this.#createRing(this.#whiteRingMaterial, "q", "w");

    this.#bQueen = getMesh("BlackQueen");
    this.#bQueen.isVisible = false;
    this.#bQueen.receiveShadows = true;
    this.#bQueenRing = this.#createRing(this.#blackRingMaterial, "q", "b");

    this.#wKing = getMesh("WhiteKing");
    this.#wKing.isVisible = false;
    this.#wKing.receiveShadows = true;
    this.#wKingRing = this.#createRing(this.#whiteRingMaterial, "k", "w");

    this.#bKing = getMesh("BlackKing");
    this.#bKing.isVisible = false;
    this.#bKing.receiveShadows = true;
    this.#bKingRing = this.#createRing(this.#blackRingMaterial, "k", "b");

    this.#wPawn = getMesh("WhitePawn");
    this.#wPawn.isVisible = false;
    this.#wPawn.receiveShadows = true;
    this.#wPawnRing = this.#createRing(this.#whiteRingMaterial, "p", "w");

    this.#bPawn = getMesh("BlackPawn");
    this.#bPawn.isVisible = false;
    this.#bPawn.receiveShadows = true;
    this.#bPawnRing = this.#createRing(this.#blackRingMaterial, "p", "b");

    this.#wRook = getMesh("WhiteRook");
    this.#wRook.isVisible = false;
    this.#wRook.receiveShadows = true;
    this.#wRookRing = this.#createRing(this.#whiteRingMaterial, "r", "w");

    this.#bRook = getMesh("BlackRook");
    this.#bRook.isVisible = false;
    this.#bRook.receiveShadows = true;
    this.#bRookRing = this.#createRing(this.#blackRingMaterial, "r", "b");

    this.#wKnight = getMesh("WhiteKnight");
    this.#wKnight.isVisible = false;
    this.#wKnight.receiveShadows = true;
    this.#wKnightRing = this.#createRing(this.#whiteRingMaterial, "n", "w");

    this.#bKnight = getMesh("BlackKnight");
    this.#bKnight.isVisible = false;
    this.#bKnight.receiveShadows = true;
    this.#bKnightRing = this.#createRing(this.#blackRingMaterial, "n", "b");
  }

  #updateRingColor(
    material: StandardMaterial,
    colorHex: string | null,
    immediate: boolean
  ) {
    const color = toBabylonColor(
      csx
        .color(colorHex ?? fallbackColor)
        .saturate(0.05)
        .darken(0.01)
        .toString()
    );
    material.diffuseColor = color;
    material.specularColor = color;
    material.ambientColor = color;
    material.emissiveColor = color;
    material.roughness = 1;
    material.alpha = 0.5;
  }

  #createRing(material: Material, type: PieceSymbol, color: Color) {
    const diameter = {
      b: 0.031802,
      r: 0.036644,
      p: 0.028984,
      q: color === "b" ? 0.0408 : 0.03997,
      k: 0.04192,
      n: 0.038996,
    }[type];
    const height = 0.0005;

    const ring = MeshBuilder.CreateCylinder("ring", {
      diameter: diameter + 0.001,
      height: height,
      tessellation: 18,
    });
    ring.material = material;
    ring.position.y = height / 2 + 0.001;
    ring.isVisible = false;

    return ring;
  }

  #fastForwardAnimations() {
    for (const animatable of this.#scene.animatables) {
      animatable.goToFrame(animatable.toFrame);
      animatable.stop();
    }
  }

  update(fen: string, whiteColor: string | null, blackColor: string | null) {
    const now = Date.now();
    const immediate = now - this.#lastUpdate < 500;
    this.#lastUpdate = now;

    if (immediate) {
      this.#fastForwardAnimations();
    }

    if (this.#blackColor !== blackColor) {
      this.#blackColor = blackColor;
      this.#updateRingColor(this.#blackRingMaterial, blackColor, immediate);
    }

    if (this.#whiteColor !== whiteColor) {
      this.#whiteColor = whiteColor;
      this.#updateRingColor(this.#whiteRingMaterial, whiteColor, immediate);
    }

    if (fen === this.#fen) {
      return;
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
        piece.move(move.to, moves.length === 1, immediate);
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
      const pieceMesh = {
        b: add.piece.color === "b" ? this.#bBishop : this.#wBishop,
        n: add.piece.color === "b" ? this.#bKnight : this.#wKnight,
        q: add.piece.color === "b" ? this.#bQueen : this.#wQueen,
        k: add.piece.color === "b" ? this.#bKing : this.#wKing,
        p: add.piece.color === "b" ? this.#bPawn : this.#wPawn,
        r: add.piece.color === "b" ? this.#bRook : this.#wRook,
      }[add.piece.type];
      const ringMesh = {
        b: add.piece.color === "b" ? this.#bBishopRing : this.#wBishopRing,
        n: add.piece.color === "b" ? this.#bKnightRing : this.#wKnightRing,
        q: add.piece.color === "b" ? this.#bQueenRing : this.#wQueenRing,
        k: add.piece.color === "b" ? this.#bKingRing : this.#wKingRing,
        p: add.piece.color === "b" ? this.#bPawnRing : this.#wPawnRing,
        r: add.piece.color === "b" ? this.#bRookRing : this.#wRookRing,
      }[add.piece.type];
      pieces.set(
        add.piece.square,
        new Piece(
          add.piece,
          pieceMesh,
          ringMesh,
          this.#shadowGenerators,
          immediate
        )
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
  #isWhite: boolean;
  #ring: InstancedMesh;

  constructor(
    properties: PieceProperties,
    pieceMesh: Mesh,
    ringMesh: Mesh,
    shadowGenerators: ShadowGenerator[],
    immediate: boolean
  ) {
    this.#isWhite = properties.color === "w";
    const instance = pieceMesh.createInstance(
      properties.color + properties.type + "-piece"
    );
    this.#positionAnimateNode = new TransformNode(
      properties + properties.type + "-position"
    );
    this.#fallAnimateNode = new TransformNode(
      properties + properties.type + "-fall"
    );
    this.#fallAnimateNode.parent = this.#positionAnimateNode;
    instance.parent = this.#fallAnimateNode;

    shadowGenerators.forEach((shadowGenerator) => {
      shadowGenerator.addShadowCaster(instance);
    });
    this.#positionAnimateNode.position = this.#getPosition(properties.square);

    this.#ring = ringMesh.createInstance(
      properties.color + properties.type + "-ring"
    );
    this.#ring.parent = this.#fallAnimateNode;

    if (immediate) {
      return;
    }

    const targetY = this.#positionAnimateNode.position.y;
    this.#positionAnimateNode.position.y -= 0.02;
    this.#positionAnimateNode.scaling = Vector3.One().scale(0.01);
    runAnimation(this.#positionAnimateNode, [
      {
        property: "scaling",
        frames: {
          0: this.#positionAnimateNode.scaling,
          40: Vector3.One(),
        },
        easingFunction: new BackEase(),
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
      },
      {
        property: "position.y",
        frames: {
          0: this.#positionAnimateNode.position.y,
          40: targetY,
        },
        easingFunction: new BackEase(),
      },
    ]);
  }

  move(to: Square, mostRecent: boolean, immediate: boolean) {
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
    if (reason !== "promoted" && typeof reason === "string") {
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
            250: this.#fallAnimateNode.position.y - 0.03,
          },
          easingFunction: new CubicEase(),
          immediate,
        },
      ]).finally(() => {
        this.#positionAnimateNode.dispose();
      });
    } else {
      const animationData: AnimationData[] = [
        {
          property: "scaling",
          frames: {
            0: this.#fallAnimateNode.scaling,
            30: Vector3.One().scale(0.01),
          },
          easingFunction: new BackEase(),
          animationType: Animation.ANIMATIONTYPE_VECTOR3,
          immediate,
        },
        {
          property: "position.y",
          frames: {
            0: this.#fallAnimateNode.position.y,
            30: this.#fallAnimateNode.position.y - 0.02,
          },
          easingFunction: new BackEase(),
          immediate,
        },
      ];

      if (reason === "promoted") {
        animationData.push({
          property: "position.x",
          frames: {
            0: this.#fallAnimateNode.position.x,
            30:
              this.#fallAnimateNode.position.x +
              (this.#isWhite ? -squareSize : squareSize),
          },
          easingFunction: new CubicEase(),
          immediate,
        });
      }

      runAnimation(this.#fallAnimateNode, animationData).finally(() => {
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
    const y = boardHeight;
    return new Vector3(x, y, z);
  }
}
