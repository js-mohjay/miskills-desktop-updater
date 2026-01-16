"use client";

import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useSocketStore } from "@/store/useSocketStore";

const HostControls = () => {
  const socket = useSocketStore((s) => s.socket);

  return (
    <div className="flex gap-3">
      <TrackToggle source={Track.Source.Microphone} className="bg-zinc-600 hover:bg-zinc-700 cursor-pointer">
        <span>Mic</span>
      </TrackToggle>

      {/* <TrackToggle source={Track.Source.Camera} className="bg-zinc-600 hover:bg-zinc-700 cursor-pointer">
        <span>Camera</span>
      </TrackToggle> */}

      <TrackToggle source={Track.Source.ScreenShare} className="bg-zinc-600 hover:bg-zinc-700 cursor-pointer">
        <span>Share</span>
      </TrackToggle>

      <button
        className="px-4! py-2! rounded-[8px] bg-red-500 hover:bg-red-600 cursor-pointer"
        onClick={() => socket?.emit("endRoom")}
      >
        <span>End Meeting</span>
      </button>

    </div>
  );
};

export default HostControls;
