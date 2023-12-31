import type { RenderParams, RenderState } from "zilch-game-engine";
import { standardStartingPosition, type Config, type State } from "./config";
import {
  Engine,
  Scene,
  SceneLoader,
  ShadowGenerator,
  SpotLight,
  GlowLayer,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { applyMeshPerfFlags, toBabylonColor } from "./ui/utils";
import { Camera } from "./ui/Camera";
import { Ground } from "./ui/Ground";
import { PieceManager } from "./ui/PieceManager";

Zilch.Renderer = class Renderer {
  #engine: Engine;
  #scene: Scene;
  #currentState: RenderState<State, Config> | null = null;

  #camera: Camera;

  #pieceManager: PieceManager;

  #shadowGenerators: ShadowGenerator[] = [];

  constructor(engine: Engine, scene: Scene) {
    this.#engine = engine;
    this.#scene = scene;

    engine.setHardwareScalingLevel(1);

    scene.autoClear = false;
    scene.autoClearDepthAndStencil = false;
    scene.skipPointerMovePicking = true;
    scene.skipPointerDownPicking = true;
    scene.skipPointerUpPicking = true;
    scene.skipFrustumClipping = true;
    scene.clearColor = toBabylonColor("#2F343C").toColor4().toLinearSpace();

    this.#camera = new Camera(scene, () => {
      const fen = this.#getFen(this.#currentState);
      this.#pieceManager.update(
        fen,
        this.#currentState?.botColors[0] ?? null,
        this.#currentState?.botColors[1] ?? null,
        this.#camera.topView
      );
    });

    this.#scene.lights.forEach((light) => {
      light.intensity /= 600;
      if (light instanceof SpotLight) {
        const shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.usePercentageCloserFiltering = true;
        this.#shadowGenerators.push(shadowGenerator);
      }
    });

    scene.meshes.forEach((mesh) => {
      applyMeshPerfFlags(mesh);
    });

    const board = scene.getMeshByName("Board")!;
    board.receiveShadows = true;

    "ABCDEFGH".split("").forEach((file) => {
      const mesh = scene.getMeshByName("File" + file)!;
      mesh.receiveShadows = true;
    });

    "12345678".split("").forEach((rank) => {
      const mesh = scene.getMeshByName("Rank" + rank)!;
      mesh.receiveShadows = true;
    });

    this.#shadowGenerators.forEach((shadowGenerator) => {
      shadowGenerator.addShadowCaster(board);
    });

    new Ground(scene);
    this.#pieceManager = new PieceManager(scene, this.#shadowGenerators);

    const gl = new GlowLayer("GlowLayer");
    gl.intensity = 1;

    this.#engine.runRenderLoop(() => {
      this.#scene.render();
    });
  }

  static async create(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    engine.loadingScreen = new (class {
      hideLoadingUI() {}
      displayLoadingUI() {}
      loadingUIBackgroundColor = "";
      loadingUIText = "";
    })();

    const scene = await SceneLoader.LoadAsync(
      ASSETS_PATH + "/",
      "chess.glb",
      engine
    );

    return new Renderer(engine, scene);
  }

  render({ current, previous }: RenderParams<State, Config>) {
    if (
      current.dimensions.height !== previous?.dimensions.height ||
      current.dimensions.width !== previous.dimensions.width
    ) {
      this.#engine.resize();
    }

    this.#currentState = current;

    this.#camera.setStatus(current.status);

    const currentFen = this.#getFen(current);
    const previousFen = this.#getFen(previous);

    if (
      currentFen !== previousFen ||
      current.botColors[0] !== previous?.botColors[0] ||
      current.botColors[1] !== previous?.botColors[1] ||
      previous === null
    ) {
      this.#pieceManager.update(
        currentFen,
        current.botColors[0] ?? null,
        current.botColors[1] ?? null,
        this.#camera.topView
      );
    }
  }

  #getFen(state: RenderState<State, Config> | null) {
    return state?.state ?? state?.config?.fen ?? standardStartingPosition;
  }
};
