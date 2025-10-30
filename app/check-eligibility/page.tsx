"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http, type Address } from "viem";
import { mainnet } from "viem/chains";
import { MENACES_CONTRACT_ADDRESS, MENACES_CONTRACT_ABI } from "@/lib/contract";

// Extend Window interface for Ethereum provider
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export default function CheckEligibility() {
  const [isConnected, setIsConnected] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [pendingAudio, setPendingAudio] = useState<HTMLAudioElement | null>(null);
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Play click sound
  const playClickSound = () => {
    const audio = new Audio("/MENACES_UI_SOUNDS_CLICK.wav");
    audio.play().catch((error) => console.log("Audio play failed:", error));
  };

  // Handle wallet connection
  const handleImageClick = async () => {
    if (!isConnected) {
      playClickSound();

      // Check if MetaMask or another wallet is installed
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          }) as string[];

          if (accounts.length > 0) {
            setWalletAddress(accounts[0] as Address);
            setIsConnected(true);
            setError(null);
          }
        } catch (err) {
          console.error("Error connecting wallet:", err);
          setError("Failed to connect wallet");
        }
      } else {
        setError("Please install MetaMask or another Web3 wallet");
      }
    }
  };

  // Check eligibility when wallet connects
  useEffect(() => {
    const checkEligibility = async () => {
      if (!walletAddress) return;

      setIsChecking(true);
      setError(null);

      // Start pending sound loop
      const audio = new Audio("/MENACES_UI_SOUNDS_pending.wav");
      audio.loop = true;
      audio.play().catch((error) => console.log("Audio play failed:", error));
      setPendingAudio(audio);

      try {
        // Call the smart contract to check balance
        // Token ID 0 is used as the eligibility check
        const balance = await publicClient.readContract({
          address: MENACES_CONTRACT_ADDRESS,
          abi: MENACES_CONTRACT_ABI,
          functionName: "balanceOf",
          args: [walletAddress, BigInt(0)],
        });

        // User is eligible if they have at least 1 token
        const eligible = balance > BigInt(0);
        setIsEligible(eligible);
        console.log(`Balance for ${walletAddress}: ${balance}, Eligible: ${eligible}`);
      } catch (err) {
        console.error("Error checking eligibility:", err);
        setError("Failed to check eligibility");
        setIsEligible(false);
      } finally {
        setIsChecking(false);

        // Stop pending sound
        audio.pause();
        audio.currentTime = 0;
        setPendingAudio(null);
      }
    };

    checkEligibility();

    // Cleanup: stop audio if component unmounts during checking
    return () => {
      if (pendingAudio) {
        pendingAudio.pause();
        pendingAudio.currentTime = 0;
      }
    };
  }, [walletAddress]);

  // Determine which image to show
  const getImageSrc = () => {
    if (!isConnected) {
      return "/MENACE_ELIGIBILITY_1.png"; // Not connected
    }
    if (isChecking || isEligible === null) {
      return "/MENACE_ELIGIBILITY_1.png"; // Checking
    }
    if (isEligible) {
      return "/MENACE_ELIGIBILITY_2.png"; // Eligible
    }
    return "/MENACE_ELIGIBILITY_3.png"; // Not eligible
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Eligibility Image - Same responsive sizing as menaces page */}
        <div
          className={`relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] ${
            !isConnected ? "cursor-pointer" : ""
          }`}
          onClick={handleImageClick}
        >
          <img
            src={getImageSrc()}
            alt="Eligibility Status"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Error message display */}
        {error && (
          <div className="text-red-500 text-center max-w-md px-4">
            {error}
          </div>
        )}

        {/* Wallet address display (optional debug info) */}
        {walletAddress && (
          <div className="text-gray-400 text-xs text-center">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
}
