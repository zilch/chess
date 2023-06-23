import { Animation, CubicEase, PBRMaterial, Scene } from "@babylonjs/core";
import { Color } from "chess.js";
import { runAnimation, toBabylonColor } from "./utils";
import * as csx from "csx";

const fallbackColor = "#666666";

export class BotMaterial {
  simple: PBRMaterial;
  outline: PBRMaterial;
  ring: PBRMaterial;
  pointer: PBRMaterial;

  #color: string | null | undefined;

  constructor(scene: Scene, player: Color, color: string | null) {
    this.simple = new PBRMaterial("SimpleMaterial", scene);
    const simpleColor = player === "w" ? "#ffffff" : "#000000";
    this.simple.albedoColor = toBabylonColor(simpleColor);
    this.simple.roughness = 1;

    this.outline = new PBRMaterial("OutlineMaterial", scene);
    this.outline.roughness = 1;
    this.ring = new PBRMaterial("RingMaterial", scene);
    this.ring.roughness = 1;
    this.ring.alpha = 0.8;

    this.pointer = new PBRMaterial("PointerMaterial", scene);
    this.pointer.roughness = 0.9;
    this.pointer.emissiveIntensity = 0.5;

    this.update(color, true);
  }

  update(color: string | null, immediate: boolean) {
    if (color === this.#color) {
      return;
    }

    this.#color = color;

    const colorAdjusted = toBabylonColor(
      csx
        .color(color ?? fallbackColor)
        .saturate(0.06)
        .darken(0.02)
        .toString()
    );

    const easingFunction = new CubicEase();

    runAnimation(this.ring, [
      {
        property: "albedoColor",
        frames: {
          0: this.ring.albedoColor,
          40: colorAdjusted.clone(),
        },
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        easingFunction,
        immediate,
      },
      {
        property: "emissiveColor",
        frames: {
          0: this.ring.emissiveColor,
          40: colorAdjusted.clone(),
        },
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        easingFunction,
        immediate,
      },
    ]);

    runAnimation(this.pointer, [
      {
        property: "albedoColor",
        frames: {
          0: this.pointer.albedoColor,
          40: colorAdjusted.clone(),
        },
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        easingFunction,
        immediate,
      },
      {
        property: "emissiveColor",
        frames: {
          0: this.pointer.emissiveColor,
          40: colorAdjusted.clone(),
        },
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        easingFunction,
        immediate,
      },
    ]);

    runAnimation(this.outline, [
      {
        property: "albedoColor",
        frames: {
          0: this.outline.albedoColor,
          40: colorAdjusted.clone(),
        },
        animationType: Animation.ANIMATIONTYPE_COLOR3,
        easingFunction,
        immediate,
      },
    ]);
  }
}
