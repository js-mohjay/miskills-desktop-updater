"use client";

import { useState } from "react";
import ChatPanel from "../video-calling/ChatPanel";
import PollPanel from "../video-calling/PollPanel";
import ParticipantsPanel from "../video-calling/ParticipantsPanel";

import { Socket } from "socket.io-client";
import { useRoomStore } from "@/store/useRoomStore";
import UnmuteRequestsPanel from "./UnmuteRequestPanel";
import { useAuth } from "@/store/auth/useAuthStore";

interface Props {
  socket: Socket | null;
  scheduleId: string;
  occurrenceId: string;
}

const SidePanel = ({ socket, scheduleId, occurrenceId }: Props) => {
  const [tab, setTab] = useState<
    "chat" | "polls" | "participants" | "unmute"
  >("chat");

  const role = useRoomStore((s) => s.role);
  const user = useAuth(s => s.user)

  const isHost =
    role === "host" || user?.role === "instructor";

  return (
    <div className="w-[360px] border-l border-white/10 bg-[#151515] p-2 flex flex-col">
      <div className="flex gap-2! mb-2!">
        {["chat", "polls", "participants"]
          .concat(isHost ? ["unmute"] : [])
          .map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 rounded-[8px] py-2 text-sm ${
                tab === t
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-white/5 text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === "chat" && (
          <ChatPanel
            socket={socket}
            scheduleId={scheduleId}
            occurrenceId={occurrenceId}
          />
        )}

        {tab === "polls" && (
          <PollPanel
            socket={socket}
            scheduleId={scheduleId}
            occurrenceId={occurrenceId}
          />
        )}

        {tab === "participants" && <ParticipantsPanel />}

        {tab === "unmute" && isHost && (
          <UnmuteRequestsPanel
            socket={socket}
            scheduleId={scheduleId}
            occurrenceId={occurrenceId}
          />
        )}
      </div>
    </div>
  );
};

export default SidePanel;
