"use client";

import {
  FocusLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

/* ---------------- STUDENT VIDEO LAYOUT ---------------- */

const StudentVideoLayout = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: true },
    ],
    { onlySubscribed: true }
  );

  // Prefer screenshare
  const screenShare = tracks.find(
    (t) => t.source === Track.Source.ScreenShare
  );

  // Fallback to host camera
  const hostCamera = tracks.find((t) => {
    try {
      const meta = JSON.parse(t.participant.metadata ?? "{}");
      return t.source === Track.Source.Camera && meta.role === "host";
    } catch {
      return false;
    }
  });

  if (screenShare) {
    return (
      <div className="h-full p-2">
        <FocusLayout
          trackRef={screenShare}
          className="h-full w-full rounded-lg bg-black"
        />
      </div>
    );
  }

  if (hostCamera) {
    return (
      <div className="h-full p-2">
        <ParticipantTile
          trackRef={hostCamera}
          className="h-full w-full rounded-lg bg-zinc-800"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center text-white opacity-70">
      Waiting for host to start…
    </div>
  );
};

export default StudentVideoLayout;
