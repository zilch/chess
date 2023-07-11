import type { StartBotParams } from "zilch-game-engine";
import { defer } from "./defer";
import { Chess } from "chess.js";

const noMatch = Symbol("noMatch");
const cancel = Symbol("cancel");

Zilch.Bot = class Bot {
  #params: StartBotParams;
  #stockfish: Worker | null = null;
  #timeUsed = 0;

  constructor(params: StartBotParams) {
    this.#params = params;
    if (this.#params.type !== "practice") {
      this.#stockfish = this.initStockfish();
    }
  }

  async start() {
    if (this.#params.type === "practice") {
      return this;
    }

    const start = performance.now();

    await this.#send("uci", (data) => {
      if (data !== "uciok") {
        return noMatch;
      }
    });

    const skilLLevel = {
      "boss-easy": 0,
      "boss-medium": 10,
      "boss-hard": 20,
    }[this.#params.type];

    this.#send(`setoption name Skill Level value ${skilLLevel}`);

    this.#timeUsed += performance.now() - start;

    return this;
  }

  static async start(params: StartBotParams) {
    return await new Bot(params).start();
  }

  async end() {
    this.#params.println("Good game!");
  }

  async move(fen: string) {
    const start = performance.now();

    const fenParts = fen.split(" ");
    const turn = parseInt(fenParts[fenParts.length - 1]);

    const estimatedTurnsRemaining = Math.max(1, 60 - turn);
    const moveTimeGame =
      (this.#params.timeLimit.game - this.#timeUsed) / estimatedTurnsRemaining;

    const moveTime = Math.min(this.#params.timeLimit.move, moveTimeGame, 3000);

    if (this.#params.type === "practice" || moveTime < 300) {
      return this.#randomMove(fen);
    }

    this.#send(`position fen ${fen}`);

    let timeoutId: NodeJS.Timeout;

    const moveOperation = this.#send(
      `go movetime ${moveTime - 200}`,
      (result) => {
        const parts = result.split(" ");

        if (parts[0] !== "bestmove") {
          return noMatch;
        }

        clearTimeout(timeoutId);
        return parts[1];
      }
    );

    timeoutId = setTimeout(() => {
      // Stop calculating after move time has elapsed
      this.#send("stop");
      timeoutId = setTimeout(() => {
        // If no response after 75ms cancel the move operation
        moveOperation.cancel();
      }, 75);
    }, moveTime - 150);

    let move = await moveOperation;

    if (move === cancel) {
      move = this.#randomMove(fen);
    }

    this.#timeUsed += performance.now() - start;

    return move;
  }

  #randomMove(fen: string) {
    const moves = new Chess(fen).moves();
    return moves[Math.floor(Math.random() * moves.length)];
  }

  #send<T extends (data: string) => unknown>(message: string, parse?: T) {
    if (this.#stockfish === null) {
      throw new Error(
        "Can't call send before stockfish worker is initialized."
      );
    }

    const deferred = defer<unknown>();

    const handleMessage = (event: MessageEvent<string>) => {
      const result = parse?.(event.data);

      if (result !== noMatch) {
        this.#stockfish?.removeEventListener("message", handleMessage);
        deferred.resolve(result);
      }
    };

    if (parse) {
      this.#stockfish.addEventListener("message", handleMessage);
    } else {
      deferred.resolve(undefined);
    }

    this.#stockfish.postMessage(message);

    const promise = deferred.promise as Promise<
      Exclude<ReturnType<T>, typeof noMatch> | typeof cancel
    > & {
      cancel(): void;
    };

    promise.cancel = () => {
      deferred.resolve(cancel);
    };

    return promise;
  }

  initStockfish() {
    const content = `importScripts("${ASSETS_PATH}/stockfish.js")`;
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  }
};
