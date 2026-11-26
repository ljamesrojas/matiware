# Project rules for Claude Code

This project is the Hardware Explorer. The full plan is in `hardware-explorer-plan.md`. Read it before starting any work.

## Git: never commit, never push

- Do **not** run `git commit`, `git push`, `git merge`, `git rebase`, `git tag` or any command that creates or rewrites commits or history. Do not open pull requests.
- You may run read-only git commands (`git status`, `git diff`, `git log`) to check what changed.
- When work is ready to commit, **tell me what to commit instead**, in this format:

  ```
  Files to commit:
  - path/to/file1
  - path/to/file2

  Suggested commands:
  git add path/to/file1 path/to/file2
  git commit -m "Short summary in imperative mood"
  ```

- The suggested commit message must **not** include any `Co-Authored-By` line, any mention of Claude or AI, or any generated-by footer. Keep it a plain one-line message (optionally with a short body describing the change).
- Group changes into sensible commits (for example: project setup, theme and layout, 3D model, interactions) and list them in order if there is more than one.
- Never suggest committing `.env` files, secrets, `node_modules/`, `dist/` or `.claude/settings.local.json`. Make sure `.gitignore` covers them.

## Phases: stop and report after each one

- Work on **one phase at a time**, in the order given in section 10 of the plan.
- When a phase is finished, **stop** and give me a phase summary in this format:

  ```
  ## Phase N summary: <phase name>

  What was built
  - ...

  How to try it
  - npm install / npm run dev, then what to click

  Checklist status
  - [x] items from the plan that are done
  - [ ] anything not done, with the reason

  Known issues or limitations
  - ...

  What to commit
  - (files, suggested git add / git commit commands, as described above)

  Next phase
  - One or two lines on what Phase N+1 will build
  ```

- Then wait. Do **not** start the next phase until I reply **"continue"** (or "continue to next phase").
- If I ask for changes after a summary, make them, give a short updated summary and an updated "What to commit" list, and wait again.

## General

- Follow the approved "Bench" theme and layout in the plan exactly.
- Keep learning content in `src/data/`, not inside components.
- Before each phase summary, run the dev server and fix any console errors.
- If something in the plan is unclear or conflicts with what you find, ask me before guessing on anything that is hard to change later.
