"use client";

import { useState, useRef, useEffect } from "react";

export default function Menaces() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [hasDrawing, setHasDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if both inputs have values
  const canSubmit = textInput.trim().length > 0 && hasDrawing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas resolution to match display size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Configure drawing style
      ctx.strokeStyle = "#c0c0c0";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Reset drawing state
      setHasDrawing(false);
    };

    initCanvas();

    // Reset canvas on window resize
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Mark that user has drawn something
    if (!hasDrawing) {
      setHasDrawing(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Play conjure press sound
    const audio = new Audio("/MENACES_UI_SOUNDS_CONJURE PRESS.wav");
    audio.play().catch((error) => console.log("Audio play failed:", error));

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get drawing data as base64 string
    const drawingData = canvas.toDataURL("image/png");

    const payload = {
      text: textInput,
      drawing: drawingData,
    };

    console.log("Submitting:", payload);

    // TODO: Replace with actual API endpoint
    // const response = await fetch("/api/menaces", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px]">
        {/* Background Image */}
        <img
          src={
            canSubmit
              ? "/MACHINE INTERFACE_2.png"
              : "/MACHINE INTERFACE_1.png"
          }
          alt="Machine Interface"
          className="w-full h-full"
        />

        {/* Text Input Area */}
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="absolute top-[120px] left-[94px] w-[128px] h-[44px] md:top-[180px] md:left-[132px] md:w-[190px] md:h-[55px] lg:top-[250px] lg:left-[190px] lg:w-[256px] lg:h-[88px] bg-transparent border-0 outline-none text-white p-1 resize-none text-[7px] md:text-[10px] lg:text-[14px] pl-[3px] pt-[1px] md:pl-[5px] md:pt-[2px] lg:pl-[7px] lg:pt-[3px]"
          placeholder="Type the defined purpose of your MENACE"
        />

        {/* Drawing Canvas Area */}
        <canvas
          ref={canvasRef}
          className="absolute top-[175px] left-[97px] w-[85px] h-[85px] md:top-[251px] md:left-[139px] md:w-[121px] md:h-[121px] lg:top-[351px] lg:left-[194px] lg:w-[169px] lg:h-[169px] cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="absolute top-[195px] left-[195px] w-[50px] h-[50px] md:top-[280px] md:left-[280px] md:w-[70px] md:h-[70px] lg:top-[395px] lg:left-[390px] lg:w-[100px] lg:h-[100px] bg-transparent border-0 cursor-pointer rounded-full"
          aria-label="Submit"
        />
      </div>
    </div>
  );
}
