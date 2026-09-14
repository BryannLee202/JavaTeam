import { useState, useRef, type PointerEvent, type ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
    glowBg: "transparent",
  });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotY = (px - 0.5) * 14;
    const rotX = (0.5 - py) * 14;
    const glowX = px * 100;
    const glowY = py * 100;

    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
      glowBg: `radial-gradient(240px circle at ${glowX.toFixed(1)}% ${glowY.toFixed(1)}%, rgba(56, 189, 248, 0.18), transparent 70%)`,
    });
  }

  function handlePointerLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
      glowBg: "transparent",
    });
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        transform: style.transform,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
        position: "relative",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: style.glowBg,
          pointerEvents: "none",
          transition: "background 0.15s ease-out",
        }}
      />
      <div style={{ position: "relative", transform: "translateZ(20px)" }}>
        {children}
      </div>
    </div>
  );
}
