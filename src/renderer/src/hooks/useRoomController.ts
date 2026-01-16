"use client";

import { useEffect, useRef } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import { useRoomStore } from "@/store/useRoomStore";
import { useAuth } from "@/store/auth/useAuthStore";
import { toast } from "sonner";
import { useUnmuteStore } from "@/store/useUnmuteStore";

interface JoinRoomPayload {
  scheduleId: string;
  occurrenceId: string;
}


export function useRoomController({
  scheduleId,
  occurrenceId,
}: JoinRoomPayload) {
  const { user } = useAuth();
  const { socket, status, connectSocket } = useSocketStore();
  const {
    setRole,
    setLivekitAuth,
    resetRoom,
  } = useRoomStore();

  const { setApproved, setRequested } = useUnmuteStore();


  const joinedRef = useRef(false);

  /* ---------------- ENSURE SOCKET ---------------- */
  useEffect(() => {
    if (status === "idle" || status === "disconnected") {
      connectSocket(false);
    }
  }, [status, connectSocket]);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    if (!socket) return;

    const onLivekitAuth = ({ token, url }: any) => {
      setLivekitAuth(token, url);
    };


    const onJoinDenied = (payload: any) => {
      toast.error(`${payload?.reason} 123` || "Unable to join meeting");
    };

    const onError = (err: any) => {
      toast.error(`${err?.message} 123` || "Socket error");
    };


    const onUnmuteGranted = () => {
      setApproved(true);
      setRequested(false);
      toast.success("You are allowed to unmute 🎤");
    };

    const onUnmuteRejected = () => {
      setRequested(false);
      toast.error("Unmute request rejected");
    };

    socket.on("unmuteGranted", onUnmuteGranted);
    socket.on("unmuteRejected", onUnmuteRejected);


    socket.on("livekit-auth", onLivekitAuth);
    socket.on("joinDenied", onJoinDenied);
    socket.on("error", onError);

    return () => {
      socket.off("livekit-auth", onLivekitAuth);
      socket.off("joinDenied", onJoinDenied);
      socket.off("error", onError);
      socket.off("unmuteGranted", onUnmuteGranted);
      socket.off("unmuteRejected", onUnmuteRejected);
    };
  }, [socket, setLivekitAuth, setRole]);

  /* ---------------- JOIN ROOM ---------------- */
  useEffect(() => {
    if (!socket || status !== "connected") return;
    if (!user || joinedRef.current) return;

    joinedRef.current = true;

    socket.emit("joinRoom", {
      scheduleId,
      occurrenceId,
      platformId: "miskills",
      userId: user._id,
      username: user.name,
    });
  }, [socket, status, user, scheduleId, occurrenceId]);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      resetRoom();
      joinedRef.current = false;
    };
  }, [resetRoom]);
}
