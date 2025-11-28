import { WalletConnect } from "@/components/Wallet-connect";
import PomodoroApp from "@/components/PomodoroApp";

export default function Home() {
  return (
   <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center">
        <WalletConnect />
      </div>
      <div className="mt-8">
        <PomodoroApp />
      </div>
    </div>
   </div>
  );
}
