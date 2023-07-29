import {
  Animation,
  BackEase,
  CubicEase,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Vector3,
} from "@babylonjs/core";
import { PieceSymbol, Square } from "chess.js";
import {
  SQUARE_SIZE,
  applyMeshPerfFlags,
  getPosition,
  isWhite,
  ringDiameterMap,
  runAnimation,
  toBabylonColor,
} from "./utils";

const fallbackColor = "#070707";

export class SquareEmphasis {
  #mesh: Mesh;
  #material: PBRMaterial;
  #square: Square | null = null;
  #primary: boolean;

  constructor(primary: boolean) {
    this.#primary = primary;
    this.#mesh = MeshBuilder.CreateDisc("recent", {
      radius: SQUARE_SIZE,
      tessellation: primary ? 32 : 16,
    });
    applyMeshPerfFlags(this.#mesh);
    this.#material = new PBRMaterial("");
    this.#material.emissiveIntensity = 0.2;
    this.#material.roughness = 1;
    this.#mesh.rotation.x = Math.PI / 2;
    this.#mesh.material = this.#material;
    this.#mesh.receiveShadows = true;
  }

  update(
    square: Square | null,
    type: PieceSymbol | null,
    color: string | null,
    immediate: boolean
  ) {
    if (square !== null) {
      this.#square = square;
    }

    const targetPosition = getPosition(this.#square ?? "a1");
    targetPosition.y += 0.00001;

    runAnimation(this.#material, [
      {
        property: "alpha",
        animationType: Animation.ANIMATIONTYPE_FLOAT,
        frames: {
          0: this.#material.alpha,
          40:
            square === null
              ? -1
              : (this.#primary ? 0.8 : 0.6) +
                (square && isWhite(square) ? 0.3 : 0),
        },
        immediate,
      },
      {
        property: "albedoColor",
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        frames: {
          0: this.#material.albedoColor,
          20: toBabylonColor(color ?? fallbackColor),
        },
        delay: 20,
        immediate,
      },
      {
        property: "emissiveColor",
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        frames: {
          0: this.#material.emissiveColor,
          20: toBabylonColor(color ?? fallbackColor),
        },
        delay: 20,
        immediate,
      },
    ]);

    const targetScale = this.#primary
      ? (0.65 * ringDiameterMap[type ?? "p"]) / SQUARE_SIZE
      : 0.1;
    runAnimation(this.#mesh, [
      {
        property: "position",
        frames: {
          0: targetPosition,
        },
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        delay: square === null ? 40 : 0,
        immediate,
      },
      {
        property: "scaling",
        frames: {
          0: this.#mesh.scaling,
          40: Vector3.One().scale(square === null ? 0 : targetScale),
        },
        delay: square !== null && this.#primary ? 26 : 0,
        easingFunction:
          square === null || !this.#primary
            ? new CubicEase()
            : new BackEase(0.8),
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        immediate,
      },
    ]);
  }
}
