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
            <div className="p-6 text-sm rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg text-white/80 transition-all hover:bg-white/10">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">Contract Address</p>
                <p className="mt-2 font-mono text-xs break-all text-white/80">{pomodoroAddress}</p>
                <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-white/40">Pool Balance</p>
                    <p className="text-3xl font-bold text-white tracking-tight mt-1">{data.contractBalance ?? "0"} <span className="text-lg font-normal text-white/60">C2FLR</span></p>
                </div>
            </div>

            {state.hash && (
                <div className="p-6 text-sm rounded-3xl border border-sky-500/20 bg-sky-500/5 backdrop-blur-xl shadow-lg transition-all hover:bg-sky-500/10">
                    <p className="text-xs font-medium uppercase tracking-widest text-sky-300/60">Last Transaction</p>
                    <p className="mt-2 font-mono text-xs text-sky-100/80 break-all leading-relaxed">{state.hash}</p>
                </div>
            )}

            {state.error && (
                <div className="p-6 text-sm rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl shadow-lg">
                    <p className="text-xs font-medium uppercase tracking-widest text-rose-300/60">Error</p>
                    <p className="mt-2 text-rose-100/90 leading-relaxed">{state.error.message}</p>
                </div>
            )}
        </div>
    )

    const renderTestingPanel = () => (
        <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-3">
                        Sandbox Mode
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Test Completion</h3>
                    <p className="mt-2 text-sm text-white/60 max-w-md leading-relaxed">
                        Simulate a successful session completion to verify rewards. This interacts with the contract exactly like a real session end.
                    </p>
                </div>
                <button
                    onClick={actions.completePomodoro}
                    disabled={state.isLoading}
                    className="group relative inline-flex justify-center items-center px-8 py-4 text-sm font-semibold text-white bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{state.isLoading ? "Processing..." : "Trigger Completion"}</span>
                </button>
            </div>
        </div>
    )

    const Page = ({ children, showTester = false }: { children: ReactNode; showTester?: boolean }) => (
        <div className="px-4 py-12 min-h-screen text-white">
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
                <section className="relative overflow-hidden p-12 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider mb-6">
                            Web3 Focus Ritual
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Focus is the new <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">currency.</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-white/60 leading-relaxed mb-10">
                            Stake C2FLR to commit to your work. Complete the 25-minute session to earn your stake back plus rewards. Break the chain, lose the stake.
                        </p>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                { title: "25 Min", subtitle: "Deep Focus" },
                                { title: "10% Bonus", subtitle: "On Completion" },
                                { title: "Smart Contract", subtitle: "Accountability" }
                            ].map((item) => (
                                <div key={item.title} className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors">
                                    <p className="text-xl font-bold text-white">{item.title}</p>
                                    <p className="text-sm text-white/50 mt-1">{item.subtitle}</p>
                                </div>
                            ))}
                        </div>
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
                <section className="relative p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Session Active</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Stay in the zone.</h1>
                            <p className="text-lg text-white/60">Potential Reward: <span className="text-white font-semibold">{(stakeValue * 1.1).toFixed(4)} C2FLR</span></p>
                        </div>
                        
                        <div className="flex items-center gap-6 p-6 rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl">
                            <div className="text-right">
                                <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-1">Time Remaining</p>
                                <p className="text-4xl font-mono font-bold text-white tracking-tight">{formatTime(remaining)}</p>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-1">Progress</p>
                                <p className="text-xl font-bold text-white">{progress.toFixed(0)}%</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="relative p-10 flex items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl min-h-[400px]">
                        <div className="relative w-72 h-72">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 130}
                                    strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                                    className="text-indigo-500 transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-bold text-white tracking-tighter font-mono">{formatTime(remaining)}</span>
                                <span className="text-sm font-medium text-white/40 mt-2 uppercase tracking-widest">Focus</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 flex flex-col justify-between rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <Stat label="Staked Amount" value={`${data.session.stakeAmount} C2FLR`} />
                            <Stat label="Bonus Reward" value={`+${(stakeValue * 0.1).toFixed(4)} C2FLR`} />
                            <Stat label="Status" value={state.isLoading ? "Syncing..." : "In Progress"} />
                            <Stat label="Mode" value="Hardcore" />
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={actions.completePomodoro}
                                disabled={state.isLoading || remaining > 0}
                                className={`w-full py-5 px-6 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                                    remaining > 0
                                        ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                                        : "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-400 hover:scale-[1.02]"
                                }`}
                            >
                                {remaining > 0 ? `Complete in ${formatTime(remaining)}` : "Claim Victory"}
                            </button>

                            <button
                                onClick={actions.forfeitPomodoro}
                                disabled={state.isLoading}
                                className="w-full py-5 px-6 rounded-2xl text-lg font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all disabled:opacity-50"
                            >
                                Give Up (Forfeit Stake)
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
                <section className="relative p-12 rounded-[2.5rem] border border-emerald-500/30 bg-emerald-900/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">Session Complete</h1>
                        <p className="text-xl text-emerald-100/80 mb-10">You stayed focused. Here is your reward.</p>

                        <div className="grid gap-4 max-w-2xl mx-auto mb-10 md:grid-cols-3">
                            <RewardStat label="Stake" value={`${data.session.stakeAmount}`} />
                            <RewardStat label="Bonus" value={`+${(stakeValue * 0.1).toFixed(4)}`} />
                            <RewardStat label="Total Payout" value={`${(stakeValue * 1.1).toFixed(4)}`} highlight />
                        </div>

                        <button
                            onClick={actions.completePomodoro}
                            disabled={state.isLoading}
                            className="px-12 py-5 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {state.isLoading ? "Processing..." : "Withdraw to Wallet"}
                        </button>
                    </div>
                </section>
            </Page>
        )
    }

    return (
        <Page>
            <section className="relative p-12 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-6">
                        Ready to Focus?
                    </div>
                    <h1 className="text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                        Commit to your work.<br/>
                        <span className="text-white/50">Earn for your time.</span>
                    </h1>
                    <p className="text-lg text-white/60 leading-relaxed">
                        Set your stake. If you complete the 25-minute session, you get it back plus a bonus. If you quit, you lose it. Simple accountability.
                    </p>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-2">Configure Session</h2>
                    <p className="text-white/50 text-sm mb-8">Set your commitment level.</p>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3" htmlFor="stake">
                                Stake Amount (C2FLR)
                            </label>
                            <div className="relative group">
                                <input
                                    id="stake"
                                    type="number"
                                    step="0.001"
                                    min="0.001"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    className="w-full px-6 py-5 text-2xl font-mono text-white bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 focus:bg-black/30 transition-all placeholder-white/20"
                                    placeholder="0.001"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-medium text-white/40 pointer-events-none">
                                    C2FLR
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-white/30 pl-2">Minimum stake: 0.001 C2FLR</p>
                        </div>

                        <button
                            onClick={() => actions.startPomodoro(stakeAmount)}
                            disabled={state.isLoading || !stakeAmount || parseFloat(stakeAmount) < 0.001}
                            className="w-full py-5 px-6 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {state.isLoading ? "Initializing..." : "Start 25m Session"}
                        </button>
                    </div>
                </div>

                <div className="p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-white mb-6">How it works</h3>
                    <div className="space-y-6">
                        {[
                            { step: "01", text: "Stake C2FLR to lock your session." },
                            { step: "02", text: "Focus for 25 minutes without interruption." },
                            { step: "03", text: "Claim your stake + 10% bonus reward." }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-xs font-bold text-white/60 font-mono">
                                    {item.step}
                                </span>
                                <p className="text-sm text-white/70 leading-relaxed pt-1">{item.text}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-xs text-indigo-200 leading-relaxed">
                            <span className="font-bold">Note:</span> Leaving the page or forfeiting will result in the loss of your staked amount to the community pool.
                        </p>
                    </div>
                </div>
            </div>
        </Page>
    )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
    </div>
)

const RewardStat = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
    <div
        className={`p-5 rounded-2xl border text-center transition-all ${highlight
                ? "bg-emerald-500/20 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                : "bg-black/20 border-white/5"
            }`}
    >
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${highlight ? "text-emerald-200" : "text-white/40"}`}>{label}</p>
        <p className={`text-xl font-bold ${highlight ? "text-white" : "text-white/90"}`}>{value}</p>
    </div>
)

export default PomodoroApp
