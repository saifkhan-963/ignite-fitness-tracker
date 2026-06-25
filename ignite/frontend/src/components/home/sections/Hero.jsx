import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/elements/Elements";

function LiveSyncWidget() {
  const canvasRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = (Math.sin(frame * 0.012) + 1) / 2;

      const barW = canvas.width - 32;
      const barH = 6;
      const barX = 16;
      const barY1 = 20;
      const barY2 = 56;

      // Track backgrounds
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.roundRect(barX, barY1, barW, barH, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(barX, barY2, barW, barH, 3);
      ctx.fill();

      // Progress YOU
      ctx.fillStyle = "#FF4D00";
      ctx.beginPath();
      ctx.roundRect(barX, barY1, barW * progress, barH, 3);
      ctx.fill();

      // Progress FRIEND
      ctx.fillStyle = "rgba(255,77,0,0.45)";
      ctx.beginPath();
      ctx.roundRect(barX, barY2, barW * progress, barH, 3);
      ctx.fill();

      // Dot YOU
      const dotX = barX + barW * progress;
      ctx.beginPath();
      ctx.arc(dotX, barY1 + barH / 2, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#FF4D00";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotX, barY1 + barH / 2, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,77,0,0.18)";
      ctx.fill();

      // Dot FRIEND
      ctx.beginPath();
      ctx.arc(dotX, barY2 + barH / 2, 9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,77,0,0.6)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotX, barY2 + barH / 2, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,77,0,0.1)";
      ctx.fill();

      // Labels left
      ctx.font = "bold 10px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#FF4D00";
      ctx.fillText("YOU", barX, barY1 - 7);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("FRIEND", barX, barY2 - 7);

      // Distance right
      const dist = (progress * 5).toFixed(2);
      ctx.font = "10px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "right";
      ctx.fillText(`${dist} km`, canvas.width - 16, barY1 - 7);
      ctx.fillText(`${dist} km`, canvas.width - 16, barY2 - 7);
      ctx.textAlign = "left";

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="relative mx-auto" style={{ width: "260px" }}>
      {/* Phone shell */}
      <div
        className="relative rounded-[44px] p-[10px]"
        style={{
          background: "linear-gradient(145deg, #2a2a2a, #111)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Side buttons */}
        <div className="absolute right-[-3px] top-[80px] w-[3px] h-[40px] rounded-r-sm" style={{ backgroundColor: "#1a1a1a" }} />
        <div className="absolute left-[-3px] top-[70px] w-[3px] h-[28px] rounded-l-sm" style={{ backgroundColor: "#1a1a1a" }} />
        <div className="absolute left-[-3px] top-[108px] w-[3px] h-[28px] rounded-l-sm" style={{ backgroundColor: "#1a1a1a" }} />

        {/* Screen */}
        <div className="rounded-[36px] overflow-hidden" style={{ backgroundColor: "#121212" }}>

          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>9:41</span>
            <div className="w-[70px] h-[20px] rounded-full" style={{ backgroundColor: "#000" }} />
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>●●●</span>
          </div>

          {/* App content */}
          <div className="px-4 pb-6 pt-2">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Live Run
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(255,77,0,0.15)", border: "1px solid rgba(255,77,0,0.3)", color: "#FF4D00", fontSize: "10px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: "#FF4D00" }} />
                LIVE
              </span>
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "48px", fontWeight: 700, color: "#F5F5F0", letterSpacing: "-3px", lineHeight: 1 }}>
                {mins}:{secs}
              </p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'Space Grotesk', sans-serif", marginTop: "4px" }}>
                elapsed time
              </p>
            </div>

            {/* Canvas */}
            <canvas ref={canvasRef} width={220} height={80} className="w-full mb-4" />

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-1 rounded-2xl p-3 mb-3"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[
                { label: "Pace", value: "5:24", unit: "/km", accent: true },
                { label: "Distance", value: "2.4", unit: "km", accent: false },
                { label: "Sync", value: "100", unit: "%", accent: true },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                    {stat.label}
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, color: stat.accent ? "#FF4D00" : "rgba(255,255,255,0.8)" }}>
                    {stat.value}<span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>{stat.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* End Run button */}
            <button
              className="w-full py-2.5 rounded-2xl"
              style={{ backgroundColor: "rgba(255,77,0,0.12)", border: "1px solid rgba(255,77,0,0.25)", color: "#FF4D00", fontSize: "12px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            >
              End Run
            </button>

          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[160px] h-[30px] rounded-full blur-2xl"
        style={{ backgroundColor: "rgba(255,77,0,0.2)" }}
      />
    </div>
  );
}

export const Hero = ({ isVisible, onOpenSignup }) => {
  return (
    <div className="container mx-auto px-6 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-16">

        {/* Left — Copy */}
        <div className={`md:w-1/2 space-y-6 transform transition-all duration-1000 ${
          isVisible.hero ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}>

          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-500 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
            Now in Early Access
          </span>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1E1E1E] dark:text-white leading-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Remote
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Running Partner.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
            Most apps track runs.{" "}
            <span className="text-[#FF3B00] font-semibold">IGNITE connects them</span>{" "}
            — live, together, right now.
          </p>

          {/* Supporting detail */}
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed">
            Join a live session with anyone, anywhere. Same start. Same pace. Real-time sync. No uploads. No waiting.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 flex-wrap pt-2">
            <button
              onClick={onOpenSignup}
              className="px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:scale-105 transform transition-all duration-300 shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Get Early Access
            </button>
            <Button
              variant="secondary"
              className="hover:scale-105 transform transition-all duration-300"
            >
              See how it works ↓
            </Button>
          </div>

        </div>

        {/* Right — Live sync widget */}
        <div className={`md:w-1/2 transform transition-all duration-1000 ${
          isVisible.hero ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}>
          <LiveSyncWidget />
        </div>

      </div>
    </div>
  );
};