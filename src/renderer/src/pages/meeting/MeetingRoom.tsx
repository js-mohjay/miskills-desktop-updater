"use client";

import { useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ConnectionStateToast,
  useLocalParticipant,
} from "@livekit/components-react";

import "@livekit/components-styles";

import { useRoomStore } from "@/store/useRoomStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useRoomController } from "@/hooks/useRoomController";

import VideoStage from "@/components/meeting/VideoStage";
import MeetingControlBar from "@/components/meeting/MeetingControlBar";
import SidePanel from "@/components/meeting/SidePanel";

/* ---------------- ROLE SYNC ---------------- */

const RoleSync = () => {
  const { localParticipant } = useLocalParticipant();
  const setRole = useRoomStore((s) => s.setRole);

  useEffect(() => {
    if (!localParticipant?.metadata) return;

    try {
      const meta = JSON.parse(localParticipant.metadata);
      if (meta?.role) {
        setRole(meta.role);
      }
    } catch {}
  }, [localParticipant, setRole]);

  return null;
};

/* ---------------- ROOM ---------------- */

const MeetingRoom = () => {
  const [searchParams] = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const occurrenceId = searchParams.get("occurrenceId");

  if (!scheduleId || !occurrenceId) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Invalid meeting link
      </div>
    );
  }

  const { livekit } = useRoomStore();
  const { socket } = useSocketStore();

  useRoomController({ scheduleId, occurrenceId });

  if (!livekit.token || !livekit.url) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Connecting to meeting…
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0f0f0f]">
      <LiveKitRoom
        token={livekit.token}
        serverUrl={livekit.url}
        connect
        className="flex h-full"
      >
        <RoleSync />
        <ConnectionStateToast />

        <div className="flex flex-1 min-h-0">
          <div className="relative flex flex-1 flex-col min-h-0">
            <VideoStage />
            <MeetingControlBar />
          </div>

          <SidePanel
            socket={socket}
            scheduleId={scheduleId}
            occurrenceId={occurrenceId}
          />
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default MeetingRoom;
