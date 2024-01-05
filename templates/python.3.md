```sh config=run
python3 -u ./main.py
```

```md file=/README.md
Check if you have Python 3 installed on your system like this:

\`\`\`
python --version
\`\`\`

If you receive a `command not found` error follow the instructions
at https://www.python.org/ to get up and running. Once you have Python
on your system you should be good to go! Run `./connect` from the
bot directory to play.
```

```py file=/main.py hidden=true
import sys
from bot import Bot

def send(channel: str, *args):
    payload = args[0] if len(args) > 0 else None

    message = "\n<<zilch>>." + channel

    if payload is not None:
        message += "." + payload

    message += "\n"

    print(message, end="", file=sys.stderr)

send("ready")

bot: Bot = None

while True:
    data = sys.stdin.readline().strip()
    channel, payload = data.split(".", 1)

    if channel == "start":
        standard_config, custom_config = payload.split(".", 1)
        game_time_limit, turn_time_limit, player = standard_config.split(",", 2)
        config = {
            "game_time_limit": int(game_time_limit),
            "turn_time_limit": int(turn_time_limit),
            "player": "white" if player == "0" else "black",
            "starting_position": custom_config
        }
        bot = Bot(config)
        send("start")
        continue

    if channel == "move":
        move = bot.move(payload)
        send("move", move)
        continue

    if channel == "end":
        bot.end(payload)
        continue
```

```py file=/bot.py
# 👋 Hello there! This file contains ready-to-edit bot code.
# 🟢 Open "README.md" for instructions on how to get started!
# TL;DR Run ./connect (or .\connect.cmd on Windows) to begin.

class Bot:
    def __init__(self, config):
      self.config = config
        print("Hello World!", config)
        pass

    def move(self, fen):
        # The current game state in Forsyth-Edwards notation
        # https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
        print(fen)

        # Return moves using algebraic notation
        # https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
        return "e4" if self.config.player == "white" else "e5"

    def end(self, fen):
        print("Good game!")
```
