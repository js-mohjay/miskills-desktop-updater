"use client";

import React from "react";
import {
  useParticipants,
} from "@livekit/components-react";

const ParticipantsPanel: React.FC = () => {
  // const room = useRoomContext();
  const participants = useParticipants();

  return (
    <div className="rounded bg-zinc-800 p-3 h-64 overflow-auto">
      <h3 className="mb-2 text-sm font-semibold text-white">
        Participants ({participants.length})
      </h3>

      {participants.map((p) => {
        const isSpeaking = p.isSpeaking;
        const isHost =
          p.metadata === "host" || p.identity?.includes("host");

        return (
          <div
            key={p.sid}
            className={`mb-1 flex items-center justify-between rounded px-2 py-1 text-sm text-white ${
              isSpeaking ? "ring-2 ring-green-500" : "bg-zinc-700"
            }`}
          >
            <span className="truncate">
              {p.identity}
              {isHost && (
                <span className="ml-1 text-xs text-green-400">(Host)</span>
              )}
            </span>

            {isSpeaking && <span>🎤</span>}
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantsPanel;
