"use client";

import { useEffect } from "react";
import {
  TrackToggle,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";

/* ---------------- STUDENT CONTROLS ---------------- */

const StudentControlBar = () => {
  const { localParticipant } = useLocalParticipant();

  // Enforce student permissions
  useEffect(() => {
    if (!localParticipant) return;

    localParticipant.setCameraEnabled(false);
    localParticipant.setScreenShareEnabled(false);
  }, [localParticipant]);

  const muted = !localParticipant?.isMicrophoneEnabled;

  return (
    <div className="flex justify-center border-t border-zinc-800 bg-black/40 p-4">
      <TrackToggle
        source={Track.Source.Microphone}
        className={`rounded-lg px-6 py-3 text-white font-medium transition ${
          muted ? "bg-red-600 hover:bg-red-500" : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {muted ? "Unmute" : "Mute"}
      </TrackToggle>
    </div>
  );
};

export default StudentControlBar;
