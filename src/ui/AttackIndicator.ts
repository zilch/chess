import {
  Animation,
  BackEase,
  InstancedMesh,
  Mesh,
  Vector3,
} from "@babylonjs/core";
import { Square } from "chess.js";
import { getPosition, runAnimation } from "./utils";

export class AttackIndicator {
  #pointer: InstancedMesh;

  constructor(
    from: Square,
    to: Square,
    pointerTemplate: Mesh,
    immediate: boolean
  ) {
    const fromPosition = getPosition(from);
    const toPosition = getPosition(to);
    const distanceX = toPosition.x - fromPosition.x;
    const distanceZ = toPosition.z - fromPosition.z;

    this.#pointer = pointerTemplate.createInstance("PointerInstance");
    this.#pointer.position = fromPosition;
    this.#pointer.rotationQuaternion = null;
    this.#pointer.rotation.z = Math.PI / 2;
    this.#pointer.scaling = Vector3.Zero();
    this.#pointer.rotation.y = Math.atan2(distanceX, distanceZ) + Math.PI / 2;
    runAnimation(this.#pointer, [
      {
        property: "scaling",
        frames: {
          0: this.#pointer.scaling,
          50: Vector3.One(),
        },
        delay: 10,
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        easingFunction: new BackEase(2),
        easingMode: "out",
        immediate,
      },
    ]);
  }

  static key(from: Square, to: Square, color: string) {
    return [from, to, color].join();
  }

  dispose(immediate: boolean) {
    runAnimation(this.#pointer, [
      {
        property: "scaling",
        frames: {
          0: this.#pointer.scaling,
          50: Vector3.Zero(),
        },
        delay: 10,
        easingMode: "in",
        animationType: Animation.ANIMATIONTYPE_VECTOR3,
        easingFunction: new BackEase(),
        immediate,
      },
    ]).then(() => {
      this.#pointer.dispose();
    });
  }
}
