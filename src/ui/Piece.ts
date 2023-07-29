import {
  BackEase,
  TransformNode,
  Vector3,
  Animation,
  SineEase,
  CubicEase,
  Quaternion,
  ShadowGenerator,
} from "@babylonjs/core";
import {
  AnimationData,
  SQUARE_SIZE,
  applyMeshPerfFlags,
  getPosition,
  runAnimation,
} from "./utils";
import { Color, Square } from "chess.js";
import { PieceTemplate } from "./PieceTemplate";

interface PieceParams {
  square: Square;
  color: Color;
  template: PieceTemplate;
  topView: boolean;
  shadowGenerators: ShadowGenerator[];
  immediate: boolean;
}

export class Piece {
  #mainNode = new TransformNode("MainNode");
  #topViewNode = new TransformNode("TopViewNode");
  #topViewDisposeAnimationNode = new TransformNode(
    "TopViewDisposeAnimationNode"
  );
  #sideViewNode = new TransformNode("SideViewNode");
  #sideViewDisposeAnimationNode = new TransformNode(
    "SideViewDisposeAnimationNode"
  );

  #color: Color;

  constructor({
    square,
    color,
    template,
    immediate,
    topView,
    shadowGenerators,
  }: PieceParams) {
    this.#color = color;

    // Create instances
    const pieceInstance = applyMeshPerfFlags(
      template.piece[color].createInstance("PieceInstance")
    );
    const pieceRingInstance = applyMeshPerfFlags(
      template.pieceRing[color].createInstance("PieceRingInstance")
    );
    const simplePieceInstance = applyMeshPerfFlags(
      template.simplePiece[color].createInstance("SimplePieceInstance")
    );
    const simplePieceOutlineInstance = applyMeshPerfFlags(
      template.simplePieceOutline[color].createInstance(
        "SimplePieceOutlineInstance"
      )
    );

    // Establish hierarchy
    this.#topViewNode.parent = this.#mainNode;
    this.#sideViewNode.parent = this.#mainNode;
    this.#sideViewDisposeAnimationNode.parent = this.#sideViewNode;
    this.#topViewDisposeAnimationNode.parent = this.#topViewNode;
    pieceRingInstance.parent = this.#sideViewDisposeAnimationNode;
    pieceInstance.parent = this.#sideViewDisposeAnimationNode;
    simplePieceInstance.parent = this.#topViewDisposeAnimationNode;
    simplePieceOutlineInstance.parent = this.#topViewDisposeAnimationNode;

    // Shadows
    shadowGenerators.forEach((shadowGenerator) => {
      shadowGenerator.addShadowCaster(simplePieceOutlineInstance);
      shadowGenerator.addShadowCaster(simplePieceInstance);
      shadowGenerator.addShadowCaster(pieceRingInstance);
      shadowGenerator.addShadowCaster(pieceInstance);
    });

    // Initial positioning
    this.#mainNode.position = getPosition(square);
    this.#sideViewNode.scaling = topView ? Vector3.Zero() : Vector3.One();
    this.#topViewNode.scaling = topView ? Vector3.One() : Vector3.Zero();
    this.#topViewNode.billboardMode = 2;
    simplePieceOutlineInstance.position.y = 0.002;
    simplePieceInstance.position.y = 0.0038;

    if (immediate) {
      return;
    }

    // Animate in
    const targetY = this.#mainNode.position.y;
    this.#mainNode.position.y -= 0.02;
    this.#mainNode.scaling = Vector3.One().scale(0.01);
    runAnimation(this.#mainNode, [
      {
        property: "scaling",
        frames: {
          0: this.#mainNode.scaling,
          40: Vector3.One(),
        },
        easingFunction: new BackEase(),
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
      },
      {
        property: "position.y",
        frames: {
          0: this.#mainNode.position.y,
          40: targetY,
        },
        easingFunction: new BackEase(),
      },
    ]);
  }

  updateTopView(topView: boolean) {
    const easingFunction = new BackEase();

    runAnimation(this.#sideViewNode, [
      {
        property: "scaling",
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        frames: {
          0: this.#sideViewNode.scaling,
          50: topView ? Vector3.Zero() : Vector3.One(),
        },
        easingFunction,
        delay: topView ? 0 : 10,
      },
    ]);
    runAnimation(this.#topViewNode, [
      {
        property: "scaling",
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        frames: {
          0: this.#topViewNode.scaling,
          50: topView ? Vector3.One() : Vector3.Zero(),
        },
        delay: topView ? 10 : 0,
        easingFunction,
      },
    ]);
  }

  move(to: Square, immediate: boolean) {
    const targetPosition = getPosition(to);

    const distanceX = targetPosition.x - this.#mainNode.position.x;
    const distanceZ = targetPosition.z - this.#mainNode.position.z;
    const distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);

    const rotationFactor = 1.2 * distance;
    const rotationX = (rotationFactor * -distanceZ) / distance;
    const rotationZ = (rotationFactor * distanceX) / distance;

    const easingFunction = new SineEase();

    runAnimation(this.#mainNode, [
      {
        frames: {
          0: this.#mainNode.rotation.z,
          25: rotationZ,
          50: 0,
        },
        property: "rotation.z",
        easingFunction,
        immediate,
      },
      {
        frames: {
          0: this.#mainNode.rotation.x,
          25: rotationX,
          50: 0,
        },
        property: "rotation.x",
        easingFunction,
        immediate,
      },
      {
        frames: {
          5: this.#mainNode.position.z,
          45: targetPosition.z,
        },
        property: "position.z",
        easingFunction,
        immediate,
      },
      {
        frames: {
          0: this.#mainNode.position.y,
          25: targetPosition.y + 0.01 + 0.2 * distance,
          50: targetPosition.y,
        },
        property: "position.y",
        easingFunction,
        immediate,
      },
      {
        frames: {
          5: this.#mainNode.position.x,
          45: targetPosition.x,
        },
        property: "position.x",
        easingFunction,
        immediate,
      },
    ]);
  }

  dispose(reason: Square | "promoted" | undefined, immediate: boolean) {
    // TODO animation out top view node!
    const disposeAnimations: Promise<void>[] = [];
    if (reason !== "promoted" && typeof reason === "string") {
      const attackedFrom = getPosition(reason);

      const distanceX = attackedFrom.x - this.#mainNode.position.x;
      const distanceZ = attackedFrom.z - this.#mainNode.position.z;

      const currentRotation =
        this.#sideViewDisposeAnimationNode.rotationQuaternion ??
        Quaternion.Zero();
      const targetRotation =
        this.#sideViewDisposeAnimationNode
          .rotate(new Vector3(-distanceZ, 0, distanceX), Math.PI / 2)
          .rotationQuaternion?.clone() ?? Quaternion.Zero();

      this.#sideViewDisposeAnimationNode.rotationQuaternion = currentRotation;

      disposeAnimations.push(
        runAnimation(this.#topViewDisposeAnimationNode, [
          {
            property: "scaling",
            animationType: Animation.ANIMATIONTYPE_VECTOR3,
            frames: {
              0: this.#topViewDisposeAnimationNode.scaling,
              40: Vector3.Zero(),
            },
            easingFunction: new BackEase(),
          },
        ]),
        runAnimation(this.#sideViewDisposeAnimationNode, [
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
              0: this.#sideViewDisposeAnimationNode.scaling,
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
              0: this.#sideViewDisposeAnimationNode.position.y,
              250: this.#sideViewDisposeAnimationNode.position.y - 0.03,
            },
            easingFunction: new CubicEase(),
            immediate,
          },
        ])
      );
    } else {
      const sideViewAnimationData: AnimationData[] = [
        {
          property: "scaling",
          frames: {
            0: this.#sideViewDisposeAnimationNode.scaling,
            30: Vector3.One().scale(0.01),
          },
          easingFunction: new BackEase(),
          animationType: Animation.ANIMATIONTYPE_VECTOR3,
          immediate,
        },
        {
          property: "position.y",
          frames: {
            0: this.#sideViewDisposeAnimationNode.position.y,
            30: this.#sideViewDisposeAnimationNode.position.y - 0.02,
          },
          easingFunction: new BackEase(),
          immediate,
        },
      ];

      const topViewAnimationData: AnimationData[] = [
        {
          property: "scaling",
          frames: {
            0: this.#topViewDisposeAnimationNode.scaling,
            40: Vector3.Zero(),
          },
          easingFunction: new BackEase(),
          animationType: Animation.ANIMATIONTYPE_VECTOR3,
          immediate,
        },
      ];

      const mainAnimationData: AnimationData[] = [];

      if (reason === "promoted") {
        mainAnimationData.push({
          property: "position.x",
          frames: {
            0: this.#mainNode.position.x,
            30:
              this.#mainNode.position.x +
              (this.#color === "w" ? -SQUARE_SIZE : SQUARE_SIZE),
          },
          easingFunction: new CubicEase(),
          immediate,
        });
      }

      disposeAnimations.push(
        runAnimation(this.#sideViewDisposeAnimationNode, sideViewAnimationData),
        runAnimation(this.#topViewDisposeAnimationNode, topViewAnimationData),
        runAnimation(this.#mainNode, topViewAnimationData)
      );
    }

    Promise.all(disposeAnimations).finally(() => {
      this.#mainNode.dispose();
    });
  }
}
