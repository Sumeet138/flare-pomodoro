"use client"

import { ReactNode, useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { usePomodoroContract } from "@/hooks/usePomodoro"
import { pomodoroAddress } from "@/lib/pomodoroContract"

const PomodoroApp = () => {
    const { isConnected } = useAccount()
    const [stakeAmount, setStakeAmount] = useState("0.001")
    const { data, actions, state } = usePomodoroContract()

    const stakeValue = useMemo(() => {
        const raw = data.session?.stakeAmount ?? "0"
        const parsed = parseFloat(raw)
        return Number.isFinite(parsed) ? parsed : 0
    }, [data.session?.stakeAmount])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const renderMeta = () => (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5 text-sm rounded-2xl border border-white/10 bg-white/5 text-white/80">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contract</p>
                <p className="mt-2 font-mono text-xs break-all text-white/70">{pomodoroAddress}</p>
                <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Pool Balance</p>
                    <p className="text-2xl font-semibold text-white">{data.contractBalance ?? "0"} C2FLR</p>
                </div>
            </div>

            {state.hash && (
                <div className="p-5 text-sm rounded-2xl border border-sky-500/40 bg-sky-500/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Last Tx Hash</p>
                    <p className="mt-2 font-mono text-xs text-sky-100 break-all">{state.hash}</p>
                </div>
            )}

            {state.error && (
                <div className="p-5 text-sm rounded-2xl border border-rose-500/40 bg-rose-500/10">
                    <p className="text-xs uppercase tracking-[0.3em] text-rose-200">Latest Error</p>
                    <p className="mt-2 text-rose-100">{state.error.message}</p>
                </div>
            )}
        </div>
    )

    const renderTestingPanel = () => (
        <div className="p-6 rounded-3xl border shadow-2xl backdrop-blur border-white/10 bg-white/5 shadow-purple-500/20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">Sandbox</p>
                    <p className="text-2xl font-semibold text-white">Complete Pomodoro (Test)</p>
                    <p className="mt-2 text-sm text-white/70">
                        Instantly call the completion logic to verify your stake + bonus payout. Perfect for checking rewards after a live session.
                    </p>
                </div>
                <button
                    onClick={actions.completePomodoro}
                    disabled={state.isLoading}
                    className="inline-flex justify-center items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-2xl shadow-lg transition-colors shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {state.isLoading ? "Running Test..." : "Complete Pomodoro (Test)"}
                </button>
            </div>
            <p className="mt-3 text-xs text-white/55">
                The contract will behave exactly as it would on main completion, so only use this when you are ready to confirm a payout.
            </p>
        </div>
    )

    const Page = ({ children, showTester = false }: { children: ReactNode; showTester?: boolean }) => (
        <div className="px-4 py-14 min-h-screen text-white bg-slate-950">
            <div className="flex flex-col gap-8 mx-auto max-w-5xl">
                {children}
                {showTester && data.session ? renderTestingPanel() : null}
                {renderMeta()}
            </div>
        </div>
    )

    if (!isConnected) {
        return (
            <Page>
                <section className="p-10 bg-gradient-to-br to-purple-900 rounded-3xl border shadow-2xl border-white/10 from-slate-900 via-slate-900 shadow-purple-500/30">
                    <p className="text-sm uppercase tracking-[0.4em] text-white/60">Web3 Focus Ritual</p>
                    <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                        Connect your wallet to unlock the Pomodoro staking experience
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-white/70">
                        Stake C2FLR, commit to 25 razor-sharp minutes, and let the chain hold you accountable. Connect a wallet to get started.
                    </p>
                    <div className="grid gap-4 mt-8 md:grid-cols-3">
                        {["25 min focus", "10% finish bonus", "Wallet-gated"].map((item) => (
                            <div key={item} className="p-4 text-sm text-center rounded-2xl border border-white/10 bg-white/5 text-white/70">
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            </Page>
        )
    }

    if (data.session && data.session.isActive) {
        const remaining = data.session.timeRemaining
        const duration = data.session.duration || 1500
        const progress = Math.min(100, Math.max(0, ((duration - remaining) / duration) * 100))

        return (
            <Page showTester>
                <section className="p-10 bg-gradient-to-br from-purple-900 rounded-3xl border shadow-2xl border-white/10 via-slate-900 to-slate-950 shadow-purple-500/30">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Session Live</p>
                            <h1 className="mt-2 text-4xl font-semibold text-white">Stay in the pocket. Rewards are loading...</h1>
                            <p className="mt-3 text-lg text-white/70">Complete the sprint to unlock {stakeValue ? (stakeValue * 1.1).toFixed(4) : "0.0000"} C2FLR.</p>
                        </div>
                        <div className="px-6 py-4 text-sm rounded-2xl border border-white/10 bg-white/5 text-white/70">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Time remaining</p>
                            <p className="mt-2 text-3xl font-semibold text-white">{formatTime(remaining)}</p>
                            <p className="mt-1 text-xs">{progress.toFixed(0)}% of the sprint cleared</p>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="p-8 text-center rounded-3xl border shadow-xl border-white/10 bg-white/5">
                        <div className="p-1 mx-auto w-64 h-64 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-full border border-white/10">
                            <div className="flex flex-col justify-center items-center w-full h-full rounded-full bg-slate-950/80">
                                <p className="text-sm uppercase tracking-[0.4em] text-white/60">Remaining</p>
                                <p className="text-5xl font-bold text-white">{formatTime(remaining)}</p>
                                <div className="mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full bg-white" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="mt-2 text-xs text-white/60">{progress.toFixed(0)}% complete</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6 rounded-3xl border shadow-xl border-white/10 bg-white/5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Stat label="Staked" value={`${data.session.stakeAmount} C2FLR`} />
                            <Stat label="Bonus" value={`+${(stakeValue * 0.1).toFixed(4)} C2FLR`} />
                            <Stat label="Status" value={state.isLoading ? "Pending..." : "Counting down"} />
                            <Stat label="Mode" value="Hardcore" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <button
                                onClick={actions.completePomodoro}
                                disabled={state.isLoading || remaining > 0}
                                className={`rounded-2xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all ${remaining > 0
                                        ? "cursor-not-allowed bg-white/10 text-white/40"
                                        : "bg-gradient-to-r from-emerald-400 to-green-500 shadow-emerald-600/40 hover:opacity-95"
                                    }`}
                            >
                                {remaining > 0 ? `Complete in ${formatTime(remaining)}` : "Complete Pomodoro"}
                            </button>

                            <button
                                onClick={actions.forfeitPomodoro}
                                disabled={state.isLoading}
                                className="px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl shadow-lg transition shadow-red-600/40 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Forfeit Session
                            </button>
                        </div>
                    </div>
                </div>
            </Page>
        )
    }

    if (data.session && data.session.completed && !data.session.withdrawn) {
        return (
            <Page showTester>
                <section className="p-10 bg-gradient-to-br from-emerald-900 via-emerald-800 rounded-3xl border shadow-2xl border-emerald-400/30 to-slate-950 shadow-emerald-500/30">
                    <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Victory Lap</p>
                    <h1 className="mt-3 text-4xl font-semibold text-white">Session complete! Collect your winnings.</h1>
                    <p className="mt-3 text-lg text-emerald-100">You locked in focus, now unlock {(stakeValue * 1.1).toFixed(4)} C2FLR.</p>

                    <div className="grid gap-5 mt-8 md:grid-cols-3">
                        <RewardStat label="Original stake" value={`${data.session.stakeAmount} C2FLR`} />
                        <RewardStat label="Bonus" value={`+${(stakeValue * 0.1).toFixed(4)} C2FLR`} />
                        <RewardStat label="Total" value={`${(stakeValue * 1.1).toFixed(4)} C2FLR`} highlight />
                    </div>

                    <button
                        onClick={actions.completePomodoro}
                        disabled={state.isLoading}
                        className="px-8 py-4 mt-8 text-lg font-semibold bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl shadow-xl transition text-slate-950 shadow-emerald-500/30 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {state.isLoading ? "Processing..." : "Claim Reward"}
                    </button>
                </section>
            </Page>
        )
    }

    return (
        <Page>
            <section className="p-10 bg-gradient-to-br to-indigo-900 rounded-3xl border shadow-2xl border-white/10 from-slate-900 via-slate-900 shadow-indigo-500/30">
                <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Next-level focus</p>
                <h1 className="mt-3 text-4xl font-semibold text-white">Stake, focus, and get rewarded for deep work.</h1>
                <p className="mt-3 max-w-2xl text-lg text-white/70">
                    Set the stake amount that keeps you honest. You either finish the sprint and receive 110% back, or get taxed for bailing.
                </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="p-8 rounded-3xl border shadow-xl border-white/10 bg-white/5">
                    <h2 className="text-2xl font-semibold text-white">Start a new Pomodoro</h2>
                    <p className="mt-2 text-sm text-white/70">Minimum stake: 0.001 C2FLR · Default duration: 25 minutes</p>

                    <div className="mt-6 space-y-4">
                        <label className="text-sm font-medium text-white/80" htmlFor="stake">
                            Stake Amount (C2FLR)
                        </label>
                        <div className="relative">
                            <input
                                id="stake"
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                className="px-5 py-4 w-full text-lg text-white rounded-2xl border outline-none border-white/10 bg-slate-900/60 focus:border-indigo-400"
                                placeholder="0.001"
                            />
                            <span className="absolute right-4 top-1/2 text-sm -translate-y-1/2 pointer-events-none text-white/60">C2FLR</span>
                        </div>

                        <button
                            onClick={() => actions.startPomodoro(stakeAmount)}
                            disabled={state.isLoading || !stakeAmount || parseFloat(stakeAmount) < 0.001}
                            className="px-6 py-4 mt-6 w-full text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl transition shadow-indigo-500/40 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {state.isLoading ? "Summoning contract..." : "Launch Pomodoro"}
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-4 text-sm rounded-3xl border shadow-xl border-white/10 bg-white/5 text-white/70">
                    <h3 className="text-xl font-semibold text-white">Runbook</h3>
                    <ul className="space-y-3">
                        <li>• Stake C2FLR and lock a 25-minute session.</li>
                        <li>• Finish the sprint to withdraw stake + 10% bonus.</li>
                        <li>• Quit early and the stake tops up the communal pool.</li>
                    </ul>
                    <div className="p-4 text-xs rounded-2xl border border-white/10 bg-white/5 text-white/60">
                        Pro tip: start small, prove consistency, then raise the stakes.
                    </div>
                </div>
            </div>
        </Page>
    )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="p-4 text-left rounded-2xl border border-white/10 bg-slate-950/60">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
        <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
)

const RewardStat = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div
        className={`rounded-2xl border p-5 text-center ${highlight
                ? "text-emerald-50 border-emerald-300 bg-emerald-400/10"
                : "text-white border-white/10 bg-white/5"
            }`}
    >
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">{label}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
)

export default PomodoroApp
