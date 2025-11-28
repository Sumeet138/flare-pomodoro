## Pomodoro Web3 App – Setup Notes

1. Run `npm install` right after scaffolding.
2. Copy your WalletConnect project ID into `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
3. Pomodoro contract details live in `lib/pomodoroContract.ts`. Update the ABI and address whenever you redeploy.
4. `npm run dev` starts the Next.js app. The Pomodoro timer is in `components/sample.tsx` (now PomodoroApp).
5. Generate an AI handoff prompt any time with `npm run prompt` (output lands in `prompt/prompt_<timestamp>.md`).

Keep this file updated with any team-specific conventions after you clone the scaffold.***

