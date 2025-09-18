import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileSlideDemo() {
  const [visible, setVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speed = 5;

  useEffect(() => {
    if (!visible && videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise) playPromise.catch(err => console.warn("Autoplay blocked:", err));
      } catch (e) {
        console.warn("Autoplay failed:", e);
      }
    }
  }, [visible]);

  return (
    <div className="bg-grad min-h-[100dvh] w-full text-neutral-800 flex flex-col items-center justify-between p-4"
         style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <header style={{ width: "100%", maxWidth: 768, paddingTop: 24 }}>
        <h1 className="text-emerald-700" style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Interactive Demo</h1>
        <p className="text-neutral-600" style={{ fontSize: 14, marginTop: 6 }}>Tap the square. It slides away and smoothly reveals a video. Reset to try again.</p>
      </header>
      <div className="center" style={{ position: "relative", width: "100%", maxWidth: 768, flex: 1, overflow: "hidden" }}>
        <AnimatePresence>
          {visible && (
            <motion.div
              key="square"
              initial={{ y: 0, opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 600, opacity: 0 }}
              transition={{ duration: speed, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { setVisible(false); setVideoEnded(false); }}
              className="rounded-2xl shadow-xl center"
              style={{ width: 160, height: 160, cursor: "pointer", background: "linear-gradient(to bottom right, #a7f3d0, #bae6fd)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>Tap me</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>to slide away</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!visible && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="rounded-2xl shadow-xl" style={{ border: "1px solid #a7f3d0", width: "100%", maxWidth: 768, background: "#fff", padding: 16 }}>
                <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 12, background: "#000" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    crossOrigin="anonymous"
                    onLoadedData={() => { try { videoRef.current?.play(); } catch {} }}
                    onEnded={() => setVideoEnded(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Sorry, your browser can't play this video.
                  </video>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ width: "100%", maxWidth: 768, paddingBottom: 24, display: "flex", justifyContent: "center" }}>
        <AnimatePresence>
          {videoEnded && (
            <motion.div
              key="bottom-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}>
              <button className="btn" onClick={() => setVisible(true)}>Play Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}