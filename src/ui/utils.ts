import {
  Material,
  EasingFunction,
  Animation,
  Node,
  Color3,
  Vector3,
  AbstractMesh,
} from "@babylonjs/core";
import { PieceSymbol, Square } from "chess.js";
import * as csx from "csx";

export const ringDiameterMap: Record<PieceSymbol, number> = {
  b: 0.031802,
  r: 0.036644,
  p: 0.028984,
  q: 0.03997,
  k: 0.04192,
  n: 0.038996,
};

export function applyMeshPerfFlags<T extends AbstractMesh>(mesh: T) {
  mesh.isPickable = false;
  mesh.doNotSyncBoundingInfo = true;
  mesh.alwaysSelectAsActiveMesh = true;
  return mesh;
}

export const SQUARE_SIZE = 0.057888;
export const BOARD_HEIGHT = 0.017393;

export function isWhite(square: Square) {
  const [file, rank] = square.split("");
  const rankIndex = "12345678".indexOf(rank);
  const fileIndex = "abcdefgh".indexOf(file);
  return (rankIndex + fileIndex) % 2 === 1;
}

export function getPosition(square: Square) {
  const [file, rank] = square.split("");
  const rankIndex = "12345678".indexOf(rank);
  const fileIndex = "abcdefgh".indexOf(file);
  const x = (rankIndex - 3.5) * -SQUARE_SIZE;
  const z = (fileIndex - 3.5) * SQUARE_SIZE;
  const y = BOARD_HEIGHT;
  return new Vector3(x, y, z);
}

export function stopAnimations(node: Node | Material) {
  node
    .getScene()
    .animatables.filter((animatable) => animatable.target === node)
    .forEach((animatable) => animatable.stop());
}

export function toBabylonColor(colorValue: string) {
  const color = csx.color(colorValue);
  return new Color3(color.red() / 255, color.green() / 255, color.blue() / 255);
}

export function getNearestStep(target: number, current: number, step: number) {
  const diff = target - current;
  const stepCount = Math.round(Math.abs(diff) / step);
  return target + (diff > 0 ? step * -stepCount : step * stepCount);
}

export interface AnimationData {
  property: string;
  frames: { [frame: number]: unknown };
  easingFunction?: EasingFunction;
  easingMode?: "inout" | "in" | "out";
  animationType?: number;
  delay?: number;
  immediate?: boolean;
}

export function runAnimation(
  target: Node | Material,
  animationData: AnimationData[]
) {
  return new Promise<void>((resolve) => {
    const animations = animationData.map((data) => {
      target.animations
        ?.filter((animation) => animation.targetProperty === data.property)
        .forEach((animation) => {
          target.getScene().stopAnimation(target, animation.name);
        });

      const animation = new Animation(
        target.name + "." + data.property + "." + target.uniqueId,
        data.property,
        60,
        data.animationType ?? Animation.ANIMATIONTYPE_FLOAT
      );

      let minFrame = Infinity;
      let maxFrame = -Infinity;

      const keys = Object.entries(data.frames).map(([frame, value]) => {
        const frameWithDelay = parseInt(frame) + (data.delay ?? 0);
        if (frameWithDelay < minFrame) {
          minFrame = frameWithDelay;
        }
        if (frameWithDelay > maxFrame) {
          maxFrame = frameWithDelay;
        }
        return {
          frame: frameWithDelay,
          value,
        };
      });

      const firstValue = keys.find((key) => key.frame === minFrame)?.value;
      const lastValue = keys.find((key) => key.frame === maxFrame)?.value;
      if ((data.delay ?? 0) > 0 && firstValue !== undefined) {
        keys.unshift({
          frame: 0,
          value: firstValue,
        });
      }

      if (data.immediate) {
        animation.setKeys([{ frame: 0, value: lastValue }]);
      } else {
        animation.setKeys(keys);
      }

      if (data.easingFunction) {
        data.easingFunction.setEasingMode(
          {
            in: EasingFunction.EASINGMODE_EASEIN,
            out: EasingFunction.EASINGMODE_EASEOUT,
            inout: EasingFunction.EASINGMODE_EASEINOUT,
          }[data.easingMode ?? "inout"]
        );

        animation.setEasingFunction(data.easingFunction);
      }

      return animation;
    });

    const maxFrame = Math.max(
      ...animationData.flatMap(({ frames, delay }) =>
        Object.keys(frames).map((frame) => parseInt(frame) + (delay ?? 0))
      )
    );

    target
      .getScene()
      .beginDirectAnimation(target, animations, 0, maxFrame, false, 1, resolve);
  });
}

export function addStyle(content: string) {
  const style = document.createElement("style");
  style.innerHTML = content;
  document.head.appendChild(style);
}
