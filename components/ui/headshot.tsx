"use client";

import { useState } from "react";
import Image from "next/image";

interface HeadshotProps {
  /** Path to the image file (relative to public folder or absolute URL) */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Size of the headshot in pixels (default: 192) */
  size?: number;
  /** Initials to display if no image (default: "AC") */
  initials?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Headshot component with graceful fallback.
 * - If an image src is provided and loads, displays the image
 * - If no image or image fails to load, displays a premium monogram avatar
 * - The fallback uses a gradient background for visual interest
 */
export function Headshot({
  src,
  alt = "Professional headshot",
  size = 192,
  initials = "AC",
  className = "",
}: HeadshotProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const showImage = src && !imageError;
  const showFallback = !src || imageError;

  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Gradient fallback - always present as background */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 50%, #0F172A 100%)",
        }}
      >
        <span
          className="font-bold text-white select-none"
          style={{
            fontSize: size * 0.35,
            letterSpacing: "0.05em",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {initials}
        </span>
      </div>

      {/* Image overlay - fades in when loaded */}
      {showImage && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={`${size}px`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            priority={size >= 150}
          />
        </div>
      )}

      {/* Subtle inner shadow for depth */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -1px 2px rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}

export default Headshot;
