"use client";

import {
  FocusLayout,
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const VideoStage = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: true },
    ],
    { onlySubscribed: true }
  );

  const screenShare = tracks.find(
    (t) => t.source === Track.Source.ScreenShare
  );

  if (screenShare) {
    return (
      <div className="flex-1 p-3">
        <FocusLayout
          trackRef={screenShare}
          className="h-full w-full rounded-[8px] bg-black"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-3">
      <GridLayout
        tracks={tracks}
        className="h-full gap-3"
        style={{ gridAutoRows: "minmax(180px, 1fr)" }}
      >
        <ParticipantTile className="rounded-[8px] bg-zinc-900" />
      </GridLayout>
    </div>
  );
};

export default VideoStage;
