"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);
  const router = useRouter();

  const menuItems = [
    { text: "CONJURE", href: "/menaces", svg: "/BUTTON1_CONJURE.svg", external: false },
    { text: "ABOUT", href: "/about", svg: "/BUTTON2_ABOUT.svg", external: false },
    {
      text: "CHECK ELIGIBILITY",
      href: "/check-eligibility",
      svg: "/BUTTON3_CHECK ELIGIBILITY.svg",
      external: false,
    },
    {
      text: "SUDOSIX",
      href: "https://x.com/sudosix",
      svg: "/BUTTON4_SUDOSIX.svg",
      external: true,
    },
  ];

  const playEnterSound = () => {
    const audio = new Audio("/MENACES_UI_SOUNDS_ENTER.wav");
    audio.play().catch((error) => console.log("Audio play failed:", error));
  };

  const playOptionSound = () => {
    const audio = new Audio("/MENACES_UI_SOUNDS_option selection.wav");
    audio.play().catch((error) => console.log("Audio play failed:", error));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIsUsingKeyboard(true);
        playOptionSound();
        setSelectedIndex((prev) =>
          prev === null ? 0 : (prev + 1) % menuItems.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIsUsingKeyboard(true);
        playOptionSound();
        setSelectedIndex((prev) =>
          prev === null
            ? menuItems.length - 1
            : (prev - 1 + menuItems.length) % menuItems.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== null) {
          playEnterSound();
          const item = menuItems[selectedIndex];
          if (item.external) {
            window.open(item.href, "_blank", "noopener,noreferrer");
          } else {
            router.push(item.href);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, menuItems, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="flex flex-col items-center gap-12">
        <nav
          className="flex flex-col items-center gap-3 w-full"
          onMouseLeave={() => setIsHovered(null)}
        >
          <Image
            src="/MENACES LOGO.png"
            alt="MENACES Logo"
            width={800}
            height={300}
            priority
            className="w-full h-auto mb-[-65px]"
          />
          {menuItems.map((item, index) => {
            const isActive = isUsingKeyboard
              ? index === selectedIndex
              : isHovered !== null
              ? isHovered === index
              : index === selectedIndex;

            const linkContent = (
              <>
                {isActive && (
                  <Image
                    src="/setup_cursor_px_perf.png"
                    alt=""
                    width={32}
                    height={32}
                    className="absolute left-[-50px]"
                  />
                )}
                <Image
                  src={item.svg}
                  alt={item.text}
                  width={500}
                  height={60}
                  className="h-[20px] sm:h-[40px] md:h-[60px] w-auto"
                  style={{ height: "clamp(20px, 5vw, 60px)", width: "auto" }}
                />
                {isActive && (
                  <Image
                    src="/setup_cursor_px_perf.png"
                    alt=""
                    width={32}
                    height={32}
                    className="absolute right-[-50px] scale-x-[-1]"
                  />
                )}
              </>
            );

            const linkProps = {
              onMouseEnter: () => {
                setIsUsingKeyboard(false);
                if (isHovered !== index) {
                  playOptionSound();
                }
                setIsHovered(index);
              },
              onMouseMove: () => {
                if (isUsingKeyboard) {
                  setIsUsingKeyboard(false);
                }
              },
              onClick: playEnterSound,
              className: "flex items-center justify-center gap-4 hover:opacity-80 transition-opacity relative",
            };

            return item.external ? (
              <a
                key={index}
                {...linkProps}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkContent}
              </a>
            ) : (
              <Link
                key={index}
                {...linkProps}
                href={item.href}
              >
                {linkContent}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
