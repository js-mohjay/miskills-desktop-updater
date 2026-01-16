"use client";

import { useEffect } from "react";
import { TrackToggle, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useSocketStore } from "@/store/useSocketStore";
import { useRoomStore } from "@/store/useRoomStore";
import { useUnmuteStore } from "@/store/useUnmuteStore";
import { toast } from "sonner";

const StudentControls = () => {
  const { localParticipant } = useLocalParticipant();
  const { socket } = useSocketStore();
  const {role, scheduleId, occurrenceId} = useRoomStore();
  const {
    requested,
    approved,
    setRequested,
  } = useUnmuteStore();

  /* ---- Force mic OFF initially ---- */
  useEffect(() => {
    if (!localParticipant) return;
    localParticipant.setMicrophoneEnabled(false);
    localParticipant.setCameraEnabled(false);
    localParticipant.setScreenShareEnabled(false);
  }, [localParticipant]);

  const muted = !localParticipant?.isMicrophoneEnabled;

  /* ---- Student clicks unmute ---- */
  const requestUnmute = () => {
    if (!socket) return;

    socket.emit("requestUnmute", {
      scheduleId: scheduleId, // or pass explicitly
      occurrenceId: occurrenceId,
    });

    setRequested(true);
    toast.info("Unmute request sent");
  };

  /* ---- Allow mic ONLY if approved ---- */
  useEffect(() => {
    if (!approved || !localParticipant) return;
    localParticipant.setMicrophoneEnabled(true);
  }, [approved, localParticipant]);

  /* ---- UI ---- */
  if (!approved && muted) {
    return (
      <button
        disabled={requested}
        onClick={requestUnmute}
        className="rounded-[8px] px-6 py-3 font-medium bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50"
      >
        {requested ? "Request Sent" : "Request Unmute"}
      </button>
    );
  }

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
