# 🌿 EcoSim: Interactive Ecosystem Simulator

EcoSim is a webapp that runs custom simulations of various species dynamics in enclosed ecological systems.

This README explains how to run the frontend (React) and the Python simulation code (Mesa / backend), both separately and together.

**Overview of runtime ports**
- React dev server (frontend): default `3000`.
- Mesa visualization server (backend): default `8521` (Mesa's default). Run them in separate terminals.

**Recommended versions**
- Python: 3.8 - 3.11
- Node.js: 16 or higher
- npm: 8 or higher

**Quick start — frontend (React)**

1. Install Node dependencies:

```bash
npm install
```

2. Start the development server (hot reload):

```bash
npm start
```

3. Build for production:

```bash
npm run build
```

If the default port `3000` is occupied, set a different port (zsh):

```bash
PORT=3001 npm start
```

**Quick start — Python simulation server (Mesa)**

1. Create and activate a virtual environment (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Launch the Mesa server (from project root):

```bash
python run.py
```

This runs `mesa_abm.server.server.launch()` (Mesa default UI). Mesa typically serves on port `8521`.

Run the frontend and backend in separate terminals to view the UI (frontend) and the Mesa visualizations.

**Running both together**
- Terminal 1 (backend):

```bash
source .venv/bin/activate
python run.py
```

- Terminal 2 (frontend):

```bash
npm install
npm start
```

Open `http://localhost:3000` for the React UI and `http://localhost:8521` for Mesa visualizations (if used).
