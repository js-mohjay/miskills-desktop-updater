"use client";

import {
  FocusLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const getRole = (metadata?: string) => {
  if (!metadata) return null;
  try {
    return JSON.parse(metadata)?.role;
  } catch {
    return null;
  }
};

const VideoStage = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: true },
    ],
    { onlySubscribed: true }
  );

  // 🔹 host screen share
  const hostScreen = tracks.find(
    (t) =>
      t.source === Track.Source.ScreenShare &&
      getRole(t.participant.metadata) === "host"
  );

  if (hostScreen) {
    return (
      <div className="flex-1 p-3">
        <FocusLayout
          trackRef={hostScreen}
          className="h-full w-full rounded bg-black"
        />
      </div>
    );
  }

  // 🔹 host camera
  const hostCamera = tracks.find(
    (t) =>
      t.source === Track.Source.Camera &&
      getRole(t.participant.metadata) === "host"
  );

  if (!hostCamera) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Waiting for host…
      </div>
    );
  }

  return (
    <div className="flex-1 p-3">
      <ParticipantTile
        trackRef={hostCamera}
        className="h-full rounded bg-zinc-900"
      />
    </div>
  );
};

export default VideoStage;
