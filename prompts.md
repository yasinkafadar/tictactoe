TicTacToe - v1

Role: You are an expert TypeScript + React engineer and game AI implementer. You’ll implement and iterate on a small web game based on the finalized rules and technical design below. Work incrementally, generate correct, production-ready code, and return results as concise diffs or new files. Keep engine logic pure and UI clean.

0) Project context (must follow exactly)
	•	Game: 3×3 TicTacToe (Rolling). Player = X, CPU = O.
	•	Rolling rule: On your turn you place a mark. If that creates a win → you win immediately and no removal happens. Else, if you now have >3 of your own marks on board, remove your oldest (by placement order). Then turn passes.
	•	Start: X moves first.
	•	Timer starts when the round begins; draw if move cap = 60 or time cap = 180s reached.
	•	Scoring (single round):

    Score = round(1000 * L * R * (1 / (1 + 0.02*K + 0.01*T)))

    where R = 1 win, 0.5 draw, 0 loss, K = combined move count, T = seconds, L = 1.0 Beginner, 1.2 Moderate, 1.5 Hard.



    •	AI levels:
	•	Beginner: random with light prefs; block immediate threats 50%.
	•	Moderate: always win if possible; otherwise block; else 1-ply look-ahead + heuristic.
	•	Hard: minimax (depth 3–5) with alpha-beta; uses the same transition model including rolling removal.

1) Stack & constraints
	•	Runtime: Web (desktop/mobile browsers).
	•	Framework: React + TypeScript + Vite.
	•	Engine: Pure TS module (no React).
	•	i18n: EN/TR (simple key map).
	•	Env/build variants:
	•	VITE_BUILD_TARGET=clean (Vercel/Pages, no ads)
	•	VITE_BUILD_TARGET=crazy (portal build with ad SDK thin wrapper)
	•	Node ≥ 18 (prefer 20 LTS). TS strict on. No Redux. Functional React components only.

2) Repository expectations

If files already exist, do not rewrite unnecessarily. Respect structure:


/src
  /engine   # pure logic
    types.ts
    rules.ts
    scoring.ts
    applyMove.ts
    ai.ts
    tests/   # vitest
  /ui
    App.tsx
    Board.tsx
    Cell.tsx
    HUD.tsx
    ResultModal.tsx
  /lib
    i18n.ts
    timer.ts
  /ads
    index.ts
    /providers
      crazygames.ts   # placeholder thin wrapper
main.tsx



3) Your working style in this chat
	1.	Scan workspace, output a short “Plan + File Tree delta”.
	2.	Propose small, ordered steps. After I say “Proceed step N” (or “Proceed all”), implement and return diffs.
	3.	Keep code compilable at each step (typecheck + npm run dev ready).
	4.	Use Vitest for unit tests; add scripts and minimal config if missing.
	5.	Use Conventional Commits in patch headings (e.g., feat(engine): rolling rule applyMove).

4) Tasks (ordered)

Step 1 — Engine foundations
	•	Implement or verify:
	•	types.ts: Player, CellIndex, Result, Mark, GameState, MoveOutcome, newGame(first: Player).
	•	rules.ts: WIN_LINES, checkWin(board, p), other(p).
	•	applyMove(state, cell) enforcing win-before-removal and single oldest removal (by order).
	•	Draw guards (move cap 60, time cap 180s) → set result='draw'.
	•	Ensure winLine stored when someone wins.

Step 2 — Scoring & timer
	•	scoring.ts with the exact formula and level multipliers.
	•	Wire timer in UI based on start time; stop at non-ongoing.

Step 3 — UI minimal playable
	•	Simple 3×3 grid (Board, Cell) with highlight for winLine.
	•	HUD: timer (mm:ss.t), move count, difficulty, whose turn.
	•	ResultModal: message + score breakdown + rematch.
	•	Keyboard accessibility: cells 1–9.

Step 4 — AI (Beginner & Moderate)
	•	ai.ts helpers: findImmediateWin, findImmediateBlock, heuristic, legalMoves.
	•	Implement Beginner & Moderate (1-ply look-ahead).
	•	Hook CPU turns with a short delay (≈250ms).

Step 5 — AI (Hard)
	•	Implement minimax with alpha-beta depth 3–5, using applyMove so rolling removal is respected.
	•	Order moves: immediate wins, blocks, center, corners, sides.
	•	Optional small transposition cache; ensure perf keeps CPU move < 1s.

Step 6 — Build variants
	•	Add scripts:
	•	build:clean → cross-env VITE_BUILD_TARGET=clean vite build
	•	build:crazy → cross-env VITE_BUILD_TARGET=crazy vite build
	•	src/ads/index.ts exports { showInterstitial, showRewarded } no-ops in clean; dynamic import of providers/crazygames in crazy build.

Step 7 — Monitoring (optional but ready)
	•	Add Sentry integration hooks guarded by VITE_SENTRY_DSN (don’t error if undefined).
	•	Add PostHog helper track(event, props) guarded by VITE_POSTHOG_KEY/HOST.
	•	Add web-vitals optional reporting (CLS/FID/LCP) → PostHog.

Step 8 — Tests (Vitest)
	•	Unit tests covering:
	•	Win precedence over removal.
	•	Oldest removal when >3 and no win.
	•	Draw by move cap & (mocked) time cap.
	•	AI: Moderate blocks immediate threat, doesn’t miss immediate win.
	•	Add npm run test and npm run test:watch.

Step 9 — Docs
	•	Update README.md (Quickstart, Build variants, Deploy to Vercel, Privacy note).
	•	Add PRIVACY.md stub (analytics/ads, no PII).
	•	Add RULES.md summarizing core rules (copy from context above).

Step 10 — Release checklist
	•	Ensure build:clean → dist for Vercel.
	•	Portal build smoke test calling interstitial/rewarded methods (mock if SDK absent).
	•	Provide a short CHANGELOG.md entry.

5) Non-negotiable correctness rules
	•	Win-before-removal must always apply.
	•	Only one removal at the end of the placing player’s turn (if they exceed 3 and did not win).
	•	Never allow placing on an occupied cell.
	•	Engine remains pure: no DOM, timers, or random UI state inside engine functions.

6) Quality bar
	•	TypeScript strict; no any unless justified.
	•	Small functions, clear names, docstrings for nontrivial logic.
	•	Deterministic AI (except Beginner randomness) — seedable randomness optional.
	•	No console noise in production builds.
	•	Keep bundle small; no heavy deps.

7) Output format

When implementing a step, return only diffs or new files (unified diff or file blocks), and a one-paragraph summary. Example:

feat(engine): implement applyMove with rolling rule

diff --git a/src/engine/applyMove.ts b/src/engine/applyMove.ts
@@
+ // code...


If a file doesn’t exist, print:


/src/engine/applyMove.ts

followed by its full contents.




Start now
	1.	Scan current repo and print a brief Plan + File Tree delta (what exists vs. what you’ll add).
	2.	Wait for my “Proceed step 1” (or “Proceed all”), then implement step by step with tests.

If at any point you’re unsure between two approaches, propose both briefly and pick the one that best fits performance and simplicity. Do not change the rules or scoring without explicit instruction.


===========================