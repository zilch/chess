```sh config=run
python3 -u ./main.py
```

```json file=/.devcontainer.json hidden=true
{
  "name": "Zilch Bot",
  "image": "mcr.microsoft.com/devcontainers/python:3.11",
  "postAttachCommand": "./connect --welcome",
  "customizations": {
    "codespaces": {
      "openFiles": ["bot.py"]
    }
  }
}
```

```md file=/README.md hidden=true
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
    bot_instance_id = args[0] if len(args) > 0 else None
    payload = args[1] if len(args) > 1 else None

    message = "\n<<zilch>>." + channel

    if bot_instance_id is not None:
        message += "." + bot_instance_id

    if payload is not None:
        message += "." + payload

    message += "\n"

    print(message, end="", file=sys.stderr)

send("ready")

bots: "dict[str, Bot]" = dict([])

while True:
    data = sys.stdin.readline().strip()
    channel, bot_instance_id, payload = data.split(".", 2)

    if channel == "start":
        standard_config, custom_config = payload.split(".", 1)
        game_time_limit, turn_time_limit, player = standard_config.split(",", 2)
        config = {
            "bot_instance_id": bot_instance_id,
            "game_time_limit": int(game_time_limit),
            "turn_time_limit": int(turn_time_limit),
            "player": "white" if player == "0" else "black",
            "starting_position": custom_config
        }
        bots[bot_instance_id] = Bot(config)
        send("start", bot_instance_id)
        continue

    if channel == "move":
        bot = bots[bot_instance_id]
        move = bot.move(payload)
        send("move", bot_instance_id, move)
        continue

    if channel == "end":
        bot = bots[bot_instance_id]
        bot.end(payload)
        bots.pop(bot_instance_id)
        continue
```

```py file=/bot.py
# 👉 Run "./connect" (or "connect.cmd" on Windows) in the terminal to get started
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
