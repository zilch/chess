import { BotOutcome } from "zilch-game-engine";
import chalk from "chalk";
import { Chess } from "chess.js";

Zilch.play = async function* (game) {
  const chess = new Chess(game.config.fen);

  if (chess.isGameOver()) {
    yield { state: chess.fen(), outcome: getOutcome(chess) };
  }

  while (true) {
    const bot = game.bots[chess.turn() === "w" ? 0 : 1];

    bot.writeln(chalk.dim(`Start turn`));
    const rawMove = await bot.move(chess.fen());
    const move = chess.move(rawMove, { strict: false });
    bot.writeln(chalk.dim(`⤷ ${move.san}`));

    if (chess.isGameOver() && !chess.isCheckmate()) {
      if (chess.isStalemate()) {
        game.bots.forEach((bot) => bot.writeln("Stalemate"));
      } else if (chess.isThreefoldRepetition()) {
        game.bots.forEach((bot) => bot.writeln("Threefold Repetition"));
      } else if (chess.isInsufficientMaterial()) {
        game.bots.forEach((bot) => bot.writeln("Insufficient Material"));
      } else {
        game.bots.forEach((bot) => bot.writeln("Fifty-Move Rule Violation"));
      }

      game.bots.forEach((bot) => {
        bot.writeln("\n" + chalk.underline("PGN") + ":");
        bot.writeln(chess.pgn());
      });
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
