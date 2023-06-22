import { BotOutcome } from "zilch-game-engine";
import chalk from "chalk";
import { Chess } from "chess.js";

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
    const bot = game.bots[chess.turn() === "w" ? 0 : 1];

    bot.writeln(chalk.dim(`Start turn`));
    const rawMove = await bot.move(chess.fen());
    const move = chess.move(rawMove, { strict: false });
    bot.writeln(chalk.dim(`⤷ ${move.san}`));

    if (chess.isGameOver()) {
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
