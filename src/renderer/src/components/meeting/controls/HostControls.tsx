"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useSocketStore } from "@/store/useSocketStore";

const HostControls = () => {
  const socket = useSocketStore((s) => s.socket);

  return (
    <div className="flex gap-3">
      <TrackToggle source={Track.Source.Microphone} className="btn-primary">
        <span>Mic</span>
      </TrackToggle>

      <TrackToggle source={Track.Source.Camera} className="btn-primary">
        <span>Camera</span>
      </TrackToggle>

      <TrackToggle source={Track.Source.ScreenShare} className="btn-primary">
        <span>Share</span>
      </TrackToggle>

      <button
        className="btn-danger"
        onClick={() => socket?.emit("endRoom")}
      >
        <span>End</span>
      </button>
    </div>
  );
};

export default HostControls;
