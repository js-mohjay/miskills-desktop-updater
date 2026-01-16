"use client";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket | null;
  scheduleId: string;
  occurrenceId: string;
}

interface UnmuteUser {
  userId: string;        // redis user id
  username: string;
  avatar?: string;
}

const UnmuteRequestsPanel: React.FC<Props> = ({
  socket,
  scheduleId,
  occurrenceId,
}) => {
  const [requests, setRequests] = useState<UnmuteUser[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  /* ---------- Fetch initial list ---------- */
  useEffect(() => {
    if (!socket) return;

    socket.emit("getUnmuteRequests", {
      scheduleId,
      occurrenceId,
    });

    socket.on("unmuteRequestList", (users: UnmuteUser[]) => {
      setRequests(users);
    });

    socket.on("unmuteRequestUpdate", (payload) => {
      if (payload.type === "requested") {
        setRequests((prev) => [
          ...prev,
          {
            userId: payload.redisUserId,
            username: payload.username,
            avatar: payload.avatar,
          },
        ]);
      }

      if (payload.type === "approved") {
        setRequests((prev) =>
          prev.filter(
            (u) => !payload.redisUserIds.includes(u.userId)
          )
        );
      }
    });

    return () => {
      socket.off("unmuteRequestList");
      socket.off("unmuteRequestUpdate");
    };
  }, [socket, scheduleId, occurrenceId]);

  /* ---------- Actions ---------- */
  const approveSelected = () => {
    const redisUserIds = Object.keys(selected).filter(
      (id) => selected[id]
    );

    if (!redisUserIds.length) return;

    socket?.emit("approveUnmute", {
      scheduleId,
      occurrenceId,
      redisUserIds,
    });

    setSelected({});
  };

  const rejectOne = (redisUserId: string) => {
    socket?.emit("rejectUnmute", {
      scheduleId,
      occurrenceId,
      redisUserId,
    });

    setRequests((prev) =>
      prev.filter((u) => u.userId !== redisUserId)
    );
  };

  return (
    <div className="rounded bg-zinc-800 p-3 h-full! overflow-auto">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Unmute Requests ({requests.length})
      </h3>

      {requests.length === 0 && (
        <p className="text-white/50 text-sm">
          No pending requests
        </p>
      )}

      {requests.map((u) => (
        <div
          key={u.userId}
          className="mb-2 flex items-center justify-between rounded bg-zinc-700 px-2 py-1 text-sm text-white"
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!selected[u.userId]}
              onChange={(e) =>
                setSelected((prev) => ({
                  ...prev,
                  [u.userId]: e.target.checked,
                }))
              }
            />
            <span>{u.username}</span>
          </label>

          <button
            onClick={() => rejectOne(u.userId)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Reject
          </button>
        </div>
      ))}

      {requests.length > 0 && (
        <button
          onClick={approveSelected}
          className="mt-3 w-full rounded bg-green-600! py-2 text-sm text-white hover:bg-green-700!"
        >
          Approve Selected
        </button>
      )}
    </div>
  );
};

export default UnmuteRequestsPanel;
