"use client";

import React from "react";
import {
  useParticipants,
} from "@livekit/components-react";
import { getRole } from "@/utils/videoCallingRoles";




const ParticipantsPanel: React.FC = () => {
  // const room = useRoomContext();
  const participants = useParticipants();
  console.log('participants', participants)
  return (
    <div className="rounded bg-zinc-800 p-3 h-full! overflow-auto space-y-2!">
      <h3 className="mb-2 text-sm font-semibold text-white">
        Participants ({participants.length})
      </h3>

      {participants.map((p) => {
        const isSpeaking = p.isSpeaking;
        const role = getRole(p.metadata);
        const isHost = role === "host";

        return (
          <div
            key={p.sid}
            className={`mb-1 flex items-center justify-between rounded px-2 py-1 text-sm text-white ${isSpeaking ? "ring-2 ring-green-500" : "bg-zinc-700"
              }`}
          >
            <span className="truncate">
              {p.name}
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
