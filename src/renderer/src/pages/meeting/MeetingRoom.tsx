"use client";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
import { useAuth } from "@/store/auth/useAuthStore";
import ActiveSpeakers from "@/components/meeting/ActiveSpeakers";

/* ---------------- ROLE SYNC ---------------- */

const RoleSync = () => {
  const { localParticipant } = useLocalParticipant();
  const setRole = useRoomStore((s) => s.setRole);
  console.log("local participant", localParticipant)
  useEffect(() => {
    if (!localParticipant?.metadata) return;
    console.log("metadata in Meeting Room: ", localParticipant.metadata)

    try {
      const meta = JSON.parse(localParticipant.metadata);
      console.log("Livekit meta in try ", meta)
      if (meta?.role) {
        setRole(meta.role);
      }
    } catch { }
  }, [localParticipant, setRole]);

  return null;
};


/* ---------------- ROOM ---------------- */

const MeetingRoom = () => {
  const navigate = useNavigate()

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

  const { livekit, role, setScheduleId, setOccurrenceId } = useRoomStore();
  const { socket } = useSocketStore();
  const { user } = useAuth()
  useRoomController({ scheduleId, occurrenceId });

  useEffect(() => {
    setScheduleId(scheduleId)
    setOccurrenceId(occurrenceId)
  }, [])


  const leaveRoom = () => {
    socket?.emit("leaveRoom", {
      platformId: "miskills",
      username: user?.name,
      scheduleId,
      userId: user?._id,
      role: role,
      occurrenceId,
    })
    setScheduleId("")
    setOccurrenceId("")
    navigate('/')
  }


  if (!livekit.token || !livekit.url) {
    return (
      <div className="flex h-screen w-screen border items-center justify-center text-white relative">
        <button
          className="absolute bg-red-500 hover:bg-red-600 z-[999] top-4 left-4 px-4 py-2 cursor-pointer rounded-[8px]"
          onClick={leaveRoom}
        >
          <span>Leave Meeting</span>
        </button>

        Connecting to meeting…
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#0f0f0f] relative">

      <button
        className="absolute bg-red-500 hover:bg-red-600 z-[999] top-4 left-4 px-4 py-2 cursor-pointer rounded-[8px]"
        onClick={() => leaveRoom()}
      >
        <span>Leave Meeting</span>
      </button>

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
            <ActiveSpeakers />
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
