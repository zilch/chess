import { BotOutcome } from "zilch-game-engine";
import { Chalk } from "chalk";
import { Chess } from "chess.js";

const chalk = new Chalk({ level: 3 });

Zilch.play = async function* (game) {
  const chess = new Chess(game.config.fen);

  const writePgn = () => {
    game.bots.forEach((bot) => {
      bot.writeln("\n" + chalk.underline("PGN:"));
      bot.writeln(chalk.whiteBright.bold(chess.pgn()));
    });
  };

  if (chess.isGameOver()) {
    writePgn();
    yield { state: chess.fen(), outcome: getOutcome(chess) };
  }

  while (true) {
    const botIndex = chess.turn() === "w" ? 0 : 1;
    const bot = game.bots[botIndex];

    bot.writeln(chalk.dim(`Start turn`));

    const rawMove = await bot.move(chess.fen());

    let move;
    try {
      move = chess.move(rawMove, { strict: false });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("invalid move")
      ) {
        bot.writeln(chalk.bold.redBright(`\nInvalid move: ${rawMove}`));

        yield {
          state: chess.fen(),
          outcome:
            botIndex === 0
              ? [BotOutcome.Error, BotOutcome.None]
              : [BotOutcome.None, BotOutcome.Error],
        };
      }

      throw error;
    }

    bot.writeln(chalk.dim(`⤷ ${move.san}`));

    if (chess.isGameOver()) {
      await Promise.all(game.bots.map((bot) => bot.end(chess.fen())));
      writePgn();
    }

    if (chess.isGameOver() && !chess.isCheckmate()) {
      if (chess.isStalemate()) {
        game.bots.forEach((bot) => bot.writeln("\nStalemate"));
      } else if (chess.isThreefoldRepetition()) {
        game.bots.forEach((bot) => bot.writeln("\nThreefold Repetition"));
      } else if (chess.isInsufficientMaterial()) {
        game.bots.forEach((bot) => bot.writeln("\nInsufficient Material"));
      } else {
        game.bots.forEach((bot) => bot.writeln("\nFifty-Move Rule Violation"));
      }
    }

    yield { state: chess.fen(), outcome: getOutcome(chess) };
  }
};

function getOutcome(chess: Chess): BotOutcome[] | null {
  if (!chess.isGameOver()) {
    return null;
  }

  if (chess.isCheckmate()) {
    return [
      chess.turn() === "w" ? BotOutcome.Defeat : BotOutcome.Victory,
      chess.turn() === "b" ? BotOutcome.Defeat : BotOutcome.Victory,
    ];
  }

  return [BotOutcome.Draw, BotOutcome.Draw];
}
