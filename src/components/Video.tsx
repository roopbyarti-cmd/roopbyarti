'use client';

import { useRef, useEffect } from "react";

export default function VideoSection() {
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {});
      }
    });
  }, []);

  const videos = [
    "/videos/v1.mp4",
    "/videos/v2.mp4",
    "/videos/v3.mp4",
    "/videos/v4.mp4",
  ];

  return (
    <div className="w-full bg-white py-10 px-4 sm:px-10">

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
         Shine with Roop ✨
      </h2>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {videos.map((src, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl shadow-md hover:scale-105 transition duration-300"
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current[i] = el;
              }}
              src={src}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-[550px] object-cover"
            />
          </div>
        ))}

      </div>
    </div>
  );
}