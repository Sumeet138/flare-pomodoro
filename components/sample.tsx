"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { usePomodoroContract } from "@/hooks/usePomodoro"
import { pomodoroAddress } from "@/lib/pomodoroContract"

const PomodoroApp = () => {
  const { isConnected, address } = useAccount()
  const [stakeAmount, setStakeAmount] = useState("0.001")

  const { data, actions, state } = usePomodoroContract()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Web3 Pomodoro</h1>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-700">
              <span className="font-semibold">⚠️ Important:</span> Connect your wallet to use the Pomodoro timer.
            </p>
          </div>
          <p className="text-gray-600">
            Stake C2FLR to maintain focus during your productivity sessions.
          </p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Active session view
  if (data.session && data.session.isActive) {
    const remaining = data.session.timeRemaining

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Pomodoro Timer</h1>
          <p className="text-center text-gray-600 mb-8">Stay focused and complete the session!</p>

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-64 h-64 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 text-white">
              <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
                <div className="text-5xl font-bold text-orange-600">
                  {formatTime(remaining)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stake Amount:</span>
              <span className="font-semibold text-orange-700">{data.session.stakeAmount} C2FLR</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-gray-600">Potential Reward:</span>
              <span className="font-semibold text-green-600">
                {(parseFloat(data.session.stakeAmount) * 1.1).toFixed(4)} C2FLR
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={actions.completePomodoro}
              disabled={state.isLoading || remaining > 0}
              className={`w-full py-4 rounded-xl font-semibold text-lg ${
                remaining > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
              } transition-all`}
            >
              {remaining > 0 ? `Complete in ${formatTime(remaining)}` : 'Complete Pomodoro ✓'}
            </button>

            <button
              onClick={actions.forfeitPomodoro}
              disabled={state.isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
            >
              Forfeit Session (Lose Stake)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Contract: {pomodoroAddress}</p>
          <p>Balance: {data.contractBalance} C2FLR</p>
        </div>
      </div>
    )
  }

  // Completed session awaiting claim
  if (data.session && data.session.completed && !data.session.withdrawn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Session Complete! 🎉</h1>
          <p className="text-center text-gray-600 mb-8">Great job staying focused!</p>

          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">Congratulations! You've completed your Pomodoro.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Stake:</span>
                <span className="text-orange-700">{data.session.stakeAmount} C2FLR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus Reward:</span>
                <span className="text-green-600">+{(parseFloat(data.session.stakeAmount) * 0.1).toFixed(4)} C2FLR</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 font-bold">
                <span>Total Reward:</span>
                <span className="text-green-600">{(parseFloat(data.session.stakeAmount) * 1.1).toFixed(4)} C2FLR</span>
              </div>
            </div>
          </div>

          <button
            onClick={actions.completePomodoro} // Reuse function to claim reward
            disabled={state.isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
          >
            {state.isLoading ? "Claiming..." : "Claim Reward"}
          </button>
        </div>
      </div>
    )
  }

  // Default state - start new pomodoro
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Web3 Pomodoro</h1>
        <p className="text-center text-gray-600 mb-8">Focus with financial incentive</p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-700 text-sm">
            Stake C2FLR to start a 25-minute focus session. Complete it to earn a 10% bonus, or forfeit your stake.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stake Amount (C2FLR)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="0.001"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-orange-500 font-medium">C2</span>
              </div>
            </div>
            <p className="text-xs text-orange-500 mt-1">
              Minimum: 0.001 C2FLR | Potential reward: +10% bonus
            </p>
          </div>

          <button
            onClick={() => actions.startPomodoro(stakeAmount)}
            disabled={state.isLoading || !stakeAmount || parseFloat(stakeAmount) < 0.001}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
          >
            {state.isLoading ? "Processing..." : "Start Pomodoro Session"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Stake C2FLR to start a 25-minute session</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Complete the session to earn 10% bonus</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Quit early and lose your stake</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Contract: {pomodoroAddress}</p>
        <p>Balance: {data.contractBalance} C2FLR</p>
      </div>

      {state.hash && (
        <div className="mt-4 max-w-md w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 font-medium">Transaction Hash</p>
          <p className="text-sm break-all text-blue-600">{state.hash}</p>
        </div>
      )}

      {state.error && (
        <div className="mt-4 max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{state.error.message}</p>
        </div>
      )}
    </div>
  )
}

export default PomodoroApp
