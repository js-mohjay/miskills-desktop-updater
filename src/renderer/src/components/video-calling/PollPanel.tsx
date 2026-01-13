"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
}

interface PollPanelProps {
  socket: Socket | null;
  scheduleId: string;
  occurrenceId: string;
}

const PollPanel: React.FC<PollPanelProps> = ({ socket, scheduleId, occurrenceId }) => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("pollHistory", (history: Poll[]) => {
      setPolls(history);
    });

    socket.on("pollEvent", (poll: Poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    socket.on("voteEvent", (updatedPoll: Poll) => {
      setPolls((prev) =>
        prev.map((p) => (p.id === updatedPoll.id ? updatedPoll : p))
      );
    });

    socket.on("pollStatusUpdate", ({ pollId, isActive }: any) => {
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, isActive } : p))
      );
    });

    return () => {
      socket.off("pollHistory");
      socket.off("pollEvent");
      socket.off("voteEvent");
      socket.off("pollStatusUpdate");
    };
  }, [socket]);

  const vote = (pollId: string, index: number) => {
    if (!socket) return;
    socket.emit("votePoll", { pollId, optionIndex: index });
  };

  return (
    <div className="bg-gray-700 rounded p-2 space-y-2">
      <h3 className="text-white font-semibold mb-2">Polls</h3>
      {polls.length === 0 && <p className="text-gray-300">No polls yet</p>}
      {polls.map((poll) => (
        <div
          key={poll.id}
          className={`p-2 rounded ${
            poll.isActive ? "bg-green-600/20" : "bg-gray-600/20"
          }`}
        >
          <p className="font-semibold text-white">{poll.question}</p>
          {poll.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => vote(poll.id, idx)}
              disabled={!poll.isActive}
              className="w-full text-left mt-1 p-1 rounded hover:bg-green-700/50 text-white"
            >
              {opt.text} ({opt.votes})
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PollPanel;
