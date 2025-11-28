# 🍅 Web3 Pomodoro App (Flare / Coston2)

## 📍 Contract Address

**0x2034c878d342f263e5658e5f83862568aaa85b16**
Explorer Link:
https://coston2-explorer.flare.network/address/0x2034c878d342f263e5658e5f83862568aaa85b16

### 📸 App Screenshot
> Add your screenshot here: Place `Screenshot.jpg` in the root directory, commit it to git, then the image will display above.

---

## 📘 Project Description

This project implements a **decentralized productivity system** deployed on the **Flare (Coston2) test network**.
Users can start a 25-minute Pomodoro focus session by staking C2FLR tokens. If they complete the session, they receive their stake back plus a 10% bonus. If they quit early, they forfeit their stake.

This contract demonstrates core blockchain concepts:

- Accepting native token value in smart contracts
- Time-based validation and session management
- Financial incentive for productivity
- Owner-only access control for contract management
- Secure value transfer
- Frontend integration with wagmi + viem

The UI allows users to:

- Start a Pomodoro session by staking C2FLR
- View active session timer
- Complete sessions to earn rewards
- Forfeit sessions (losing their stake)
- Track contract balance and usage

---

## 💡 What It Does

- Accepts C2FLR deposits from users starting Pomodoro sessions
- Tracks all active sessions with start time and stake amount
- Enforces a 25-minute session duration
- Allows users to claim rewards by completing sessions
- Provides automatic forfeit functionality for early session termination
- Allows reading:
  - Active session status
  - Time remaining in current session
  - Contract balance

---

## ✨ Features

### 🎯 Productivity Features

- 25-minute Pomodoro timer with visual countdown
- Stake-based financial incentive system
- Session completion rewards (10% bonus)
- Clear visual feedback for all states

### 🛡 Security Features

- Time-based session validation
- Stake forfeiture penalty for early quitting
- Session state management
- Owner withdrawal function for contract management

### 🧩 Technical Features

- Deployed on **Flare Coston2 testnet**
- Lightweight and gas-efficient
- Clean, simple ABI
- Full frontend integration using:
  - **wagmi**
  - **viem**
  - **React server components**

### 🖥 Frontend

- Wallet-gated interactions
- Real-time contract state updates
- Loading + pending state handling
- Visual timer with circular progress
- Professional UI with gradient backgrounds
- Responsive design for all devices

---

## 🧠 How It Solves Problems

Traditional productivity apps lack real consequences for distraction.
This project solves this issue by providing:

### ✔ Financial Stakes

Users must stake real tokens to maintain focus, creating genuine accountability.

### ✔ Trustless Execution

Session completion is enforced algorithmically with no manual intervention.

### ✔ Transparent Mechanics

All stakes and rewards are publicly visible on-chain.

### ✔ Automated Rewards

Rewards are distributed automatically with no manual handling.

### ✔ Educational Value

Helps developers understand:

- Token staking and rewards
- Time-based smart contract logic
- Session management patterns
- Frontend ↔ contract integration

---

## 📦 Use Cases

- Personal productivity tool
- Blockchain education
- Web3 dApp demonstration
- Financial incentive system prototype
- Reference contract for productivity applications

---

For any questions or enhancements, feel free to reach out!
