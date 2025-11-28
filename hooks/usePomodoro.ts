"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { pomodoroABI, pomodoroAddress } from "@/lib/pomodoroContract"

export const usePomodoroContract = () => {
  const { address, isConnected } = useAccount()

  // Read functions
  const { data: sessionInfo, refetch: refetchSession, isLoading: sessionLoading } = useReadContract({
    address: pomodoroAddress,
    abi: pomodoroABI,
    functionName: "getSessionInfo",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
      refetchInterval: 1000, // Refetch every second for timer updates
    }
  })

  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: pomodoroAddress,
    abi: pomodoroABI,
    functionName: "getContractBalance",
    query: {
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  })

  const { data: isActive, refetch: refetchActive } = useReadContract({
    address: pomodoroAddress,
    abi: pomodoroABI,
    functionName: "isActive",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!address,
    }
  })

  const { writeContractAsync, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isConfirmed) {
      refetchSession()
      refetchActive()
      refetchBalance()
    }
  }, [isConfirmed, refetchSession, refetchActive, refetchBalance])

  const startPomodoro = async (stakeAmount: string) => {
    const amount = parseEther(stakeAmount)
    await writeContractAsync({
      address: pomodoroAddress,
      abi: pomodoroABI,
      functionName: "startPomodoro",
      value: amount,
    })
  }

  const completePomodoro = async () => {
    await writeContractAsync({
      address: pomodoroAddress,
      abi: pomodoroABI,
      functionName: "completePomodoro",
    })
  }

  const forfeitPomodoro = async () => {
    await writeContractAsync({
      address: pomodoroAddress,
      abi: pomodoroABI,
      functionName: "forfeitPomodoro",
    })
  }

  return {
    data: {
      session: sessionInfo ? {
        startTime: Number(sessionInfo[0]),
        duration: Number(sessionInfo[1]),
        completed: sessionInfo[2],
        stakeAmount: formatEther(BigInt(sessionInfo[3])),
        withdrawn: sessionInfo[4],
        timeRemaining: Number(sessionInfo[5]),
        isActive: sessionInfo[6],
      } : null,
      contractBalance: contractBalance ? formatEther(BigInt(contractBalance)) : "0",
      isActive: isActive,
    },
    actions: {
      startPomodoro,
      completePomodoro,
      forfeitPomodoro,
    },
    state: {
      isLoading: isPending || isConfirming,
      isPending,
      isConfirming,
      isConfirmed,
      hash,
      error,
    },
  }
}