"use client";

import {
  ParticipantTile,
  ParticipantContext,
  useParticipants,
} from "@livekit/components-react";

const getRole = (metadata?: string) => {
  if (!metadata) return null;
  try {
    return JSON.parse(metadata)?.role;
  } catch {
    return null;
  }
};

const ActiveSpeakers = () => {
  const participants = useParticipants();

  const speakingStudents = participants.filter(
    (p) => getRole(p.metadata) === "student" && p.isSpeaking
  );

  if (!speakingStudents.length) return null;

  return (
    <div className="absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 gap-3">
      {speakingStudents.map((p) => (
        <ParticipantContext.Provider value={p} key={p.sid}>
          <div className="rounded-lg ring-2 ring-green-500">
            <ParticipantTile className="h-40 w-56 rounded bg-zinc-900" />
          </div>
        </ParticipantContext.Provider>
      ))}
    </div>
  );
};

export default ActiveSpeakers;
