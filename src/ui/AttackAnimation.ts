import {
  Animation,
  CubicEase,
  MeshBuilder,
  PBRMaterial,
  Vector3,
} from "@babylonjs/core";
import { Square } from "chess.js";
import {
  SQUARE_SIZE,
  getPosition,
  runAnimation,
  toBabylonColor,
} from "./utils";

export class AttackAnimation {
  constructor(square: Square, color: string | null, delay: number) {
    const mesh = MeshBuilder.CreateDisc("AttackAnimation", {
      radius: SQUARE_SIZE * 1.3,
      tessellation: 32,
    });
    const material = new PBRMaterial("attack");
    material.roughness = 1;
    material.albedoColor = toBabylonColor(color ?? "#070707");
    material.backFaceCulling = true;
    mesh.rotation.x = Math.PI / 2;
    mesh.material = material;
    mesh.position = getPosition(square);
    mesh.position.y += 0.0001;
    mesh.scaling = Vector3.Zero();

    Promise.all([
      runAnimation(material, [
        {
          property: "alpha",
          animationType: Animation.ANIMATIONTYPE_FLOAT,
          frames: {
            0: 1,
            60: -1,
          },
          delay,
          easingMode: "out",
          easingFunction: new CubicEase(),
        },
      ]),

      runAnimation(mesh, [
        {
          property: "scaling",
          frames: {
            0: Vector3.One().scale(0.2),
            60: Vector3.One(),
          },
          delay,
          easingMode: "out",
          animationType: Animation.ANIMATIONTYPE_VECTOR3,
          easingFunction: new CubicEase(),
        },
      ]),
    ]).then(() => {
      mesh.dispose();
    });
  }
}
