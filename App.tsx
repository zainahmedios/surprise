import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Mobile-first interactive demo: tap the square -> it slides down & disappears. Reset brings it back.
// After square disappears, a video area smoothly fades in, auto-plays once (no controls).
// When the video finishes, a button appears at the bottom to reset.

export default function MobileSlideDemo() {
  const [visible, setVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speed = 5; // seconds, fixed

  useEffect(() => {
    if (!visible && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Autoplay blocked:", err));
        }
      } catch (e) {
        console.warn("Autoplay failed:", e);
      }
    }
  }, [visible]);

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-emerald-50 via-sky-50 to-yellow-50 text-neutral-800 flex flex-col items-center justify-between p-4 select-none">
      {/* Header */}
      <header className="w-full max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-700">Interactive Demo</h1>
        <p className="text-sm text-neutral-600 mt-1">Tap the square. It slides away and smoothly reveals a video. Reset to try again.</p>
      </header>

      {/* Play Area */}
      <div className="relative w-full max-w-md flex-1 grid place-items-center overflow-hidden">
        <AnimatePresence>
          {visible && (
            <motion.div
              key="square"
              initial={{ y: 0, opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 600, opacity: 0 }}
              transition={{ duration: speed, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                setVisible(false);
                setVideoEnded(false);
              }}
              className="w-40 h-40 rounded-2xl bg-gradient-to-br from-emerald-200 to-sky-200 shadow-xl shadow-emerald-200/40 grid place-items-center cursor-pointer"
            >
              <div className="text-center">
                <div className="text-lg font-medium">Tap me</div>
                <div className="text-xs opacity-80">to slide away</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video that appears smoothly as square disappears */}
        <AnimatePresence>
          {!visible && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-2xl border border-emerald-200 shadow-lg max-w-full max-h-[70%] bg-white grid place-items-center p-6 text-neutral-500">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  crossOrigin="anonymous"
                  onLoadedData={() => {
                    try {
                      videoRef.current?.play();
                    } catch {}
                  }}
                  onEnded={() => setVideoEnded(true)}
                  className="w-full h-full object-cover rounded-lg"
                >
                  <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  Sorry, your browser can't play this video.
                </video>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="w-full max-w-md pb-6">
        <div className="flex items-center justify-center">
          {videoEnded && (
            <Button
              onClick={() => setVisible(true)}
              variant="default"
              className="rounded-2xl px-5 bg-emerald-300 hover:bg-emerald-400 text-neutral-800"
            >
              Play Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
