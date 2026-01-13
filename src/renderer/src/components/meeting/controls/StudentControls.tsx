"use client";

import { useEffect } from "react";
import { TrackToggle, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";

const StudentControls = () => {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setCameraEnabled(false);
    localParticipant.setScreenShareEnabled(false);
  }, [localParticipant]);

  const muted = !localParticipant?.isMicrophoneEnabled;

  return (
    <TrackToggle
      source={Track.Source.Microphone}
      className={`rounded-[8px] px-6 py-3 font-medium transition ${
        muted
          ? "bg-red-600 hover:bg-red-500"
          : "bg-green-600 hover:bg-green-500"
      }`}
    >
      <span>{muted ? "Unmute" : "Mute"}</span>
    </TrackToggle>
  );
};

export default StudentControls;
