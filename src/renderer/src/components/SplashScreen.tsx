import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import splashVideo from "@/assets/splash.mp4"

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [isDone, setIsDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setTimeout(() => {
        setIsDone(true);
      }, 350); // same pause as before
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => onFinish?.()}>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <video
            ref={videoRef}
            src={splashVideo}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
