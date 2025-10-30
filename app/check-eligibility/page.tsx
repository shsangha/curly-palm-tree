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

  // Reset to initial state
  const resetEligibilityCheck = () => {
    playClickSound();
    setIsConnected(false);
    setIsEligible(null);
    setWalletAddress(null);
    setError(null);
  };

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (typeof window.ethereum === "undefined") return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountArray = accounts as string[];
      if (accountArray.length === 0) {
        // User disconnected their wallet
        resetEligibilityCheck();
      } else if (accountArray[0] !== walletAddress) {
        // User switched to a different account
        playClickSound();
        setWalletAddress(accountArray[0] as Address);
        setIsEligible(null); // Reset eligibility to trigger re-check
      }
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      }
    };
  }, [walletAddress]);

  // Handle backspace or escape key to reset after check is complete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only allow reset if check is complete (not checking and connected)
      if ((e.key === "Backspace" || e.key === "Escape") && isConnected && !isChecking && isEligible !== null) {
        e.preventDefault();
        resetEligibilityCheck();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConnected, isChecking, isEligible]);

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
        // Call the smart contract to check total balance across all token IDs
        // Using ownerBalance instead of balanceOf since each user gets a unique token ID
        const balance = await publicClient.readContract({
          address: MENACES_CONTRACT_ADDRESS,
          abi: MENACES_CONTRACT_ABI,
          functionName: "ownerBalance",
          args: [walletAddress],
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

        {/* Purchase Links */}
        <div className="flex gap-4 mt-4">
          <a
            href="https://opensea.io/item/ethereum/0x5394603d355482c126f7cf3603e419b67b31b76e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors underline text-base"
          >
            PURCHASE SUDOPASS ON OPENSEA
          </a>
          <a
            href="https://magiceden.io/collections/ethereum/0x5394603d355482c126f7cf3603e419b67b31b76e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors underline text-base"
          >
            PURCHASE SUDOPASS ON MAGICEDEN
          </a>
        </div>
      </div>
    </div>
  );
}
