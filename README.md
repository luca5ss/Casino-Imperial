# Casino Imperial

Offline browser game in Czech, styled as a classic European casino. The game uses vanilla HTML, CSS and JavaScript; Python is only used to generate its JSON balance data and simulate the economy.

## Run the game

Open `index.html` directly in a modern browser. The game does not need a server, Python, network access, or installed packages. It attempts to load the generated files in `data/`; when browser file-access rules prevent JSON fetches, built-in balancing values keep the game playable.

For local testing with the JSON data enabled, run a static file server from the project directory, for example:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000`.

## Save data

Progress is saved automatically in browser `localStorage`. Use the gear icon to export a JSON backup or import a previously exported save. Saves are local to the browser profile.

## Python economy tools

Both tools use only the Python 3 standard library:

```powershell
py python\generate_config.py
py python\balance_economy.py --days 90
```

The generator writes the six game configuration files to `data/`. Running the simulator checks a sample city's cash flow and reports the results; neither script is required to play.

## Game features

- Mechanical five-reel slots, European roulette and blackjack with multiple hands, insurance, double-down and split.
- Clickable city districts, property improvements, vehicles, businesses, jobs, marketplace, bank and short-term high-interest loans.
- VIP and prestige progression, daily missions, cashback, property income, auctions and responsible-play controls.
- Czech interface, sound toggle, responsive layout and JSON save export/import.
