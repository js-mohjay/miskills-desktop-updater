"use client";

import { useParticipants } from "@livekit/components-react";

const ParticipantsPanel = () => {
  const participants = useParticipants();

  return (
    <div className="h-full overflow-auto rounded-[8px] bg-zinc-900 p-3">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Participants ({participants.length})
      </h3>

      {participants
        .sort((a, b) => Number(b.isSpeaking) - Number(a.isSpeaking))
        .map((p) => {
          let role = "";
          try {
            role = JSON.parse(p.metadata ?? "{}")?.role;
          } catch {}

          return (
            <div
              key={p.sid}
              className={`mb-2 flex items-center justify-between rounded-[8px] px-3 py-2 text-sm ${
                p.isSpeaking
                  ? "bg-violet-600/20 ring-2 ring-violet-500"
                  : "bg-zinc-800"
              }`}
            >
              <span className="truncate text-white">
                {p.identity}
                {role === "host" && " 👑"}
              </span>

              {p.isSpeaking && <span>🎤</span>}
            </div>
          );
        })}
    </div>
  );
};

export default ParticipantsPanel;
