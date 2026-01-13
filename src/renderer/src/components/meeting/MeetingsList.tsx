"use client";

import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";

import { videoCallingService } from "@/services/videoCalling.service";
import { useAuth } from "@/store/auth/useAuthStore";
// import { useSocketStore } from "@/store/useSocketStore";

import { useNavigate } from "react-router";

const MeetingsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const participantId = user?._id;
  const userRole = user?.role
  
  // const { socket, connectSocket, status } = useSocketStore();

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["participant-meetings", participantId],
    queryFn: async () => {
      const res = await videoCallingService.getParticipantMeetings(
        participantId as string
      );
      return res.data.data;
    },
    enabled: !!participantId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="w-full min-h-screen p-10">
        <p className="mt-6 text-xl">Loading meetings...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full min-h-screen p-10">
        <p className="mt-6 text-xl text-red-500">
          {(error as Error).message}
        </p>
      </section>
    );
  }

  const now = new Date();

  const classified = data.reduce(
    (acc: any, meet: any) => {
      const start = new Date(meet.startDateTime);
      const end = new Date(meet.endDateTime);

      if (["scheduled", "live"].includes(meet.status) && start <= now && end >= now) {
        acc.active.push(meet);
      } else if (meet.status === "scheduled" && start > now) {
        acc.upcoming.push(meet);
      } else {
        acc.past.push(meet);
      }

      return acc;
    },
    { active: [], upcoming: [], past: [] }
  );

  const renderCards = (list: any[]) =>
    list.length === 0 ? (
      <p className="text-lg opacity-70 py-4!">No meetings</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {list.map((meet: any) => {
          const start = new Date(meet.startDateTime);
          const end = new Date(meet.endDateTime);
          // const isActive = start <= now && end >= now;

          return (
            <div
              key={meet._id}
              className="card border border-gray-400! rounded-[8px] p-4! xl:p-6! space-y-3!"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-2xl font-semibold">{meet.title}</h4>
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-600">
                  {meet.status}
                </span>
              </div>

              <p className="text-lg opacity-90">Batch: {meet.group}</p>

              <div className="opacity-100 text-lg flex gap-4">
                <p><strong className={"font-semibold!"}>Start Time: </strong>{start.toLocaleString()}</p>
                <p><strong className={"font-semibold!"}>End Time: </strong>{end.toLocaleString()}</p>
              </div>

              {userRole === "instructor" && ["live", "scheduled"].includes(meet.status) && (
                <button
                  onClick={() => {
                    try {
                      navigate(
                        `/meetings/room?scheduleId=${meet.scheduleId}&occurrenceId=${meet._id}`
                      );
                    } catch {
                      toast.error("Failed to join meeting");
                    }
                  }}
                  className="px-6 py-2 rounded bg-green-600 text-white"
                >
                  Join Now
                </button>
              )}


              {userRole === "student" && ["live", "scheduled"].includes(meet.status) && (
                <button
                  onClick={() => {
                    try {
                      navigate(
                        `/meetings/room?scheduleId=${meet.scheduleId}&occurrenceId=${meet._id}`
                      );
                    } catch {
                      toast.error("Failed to join meeting");
                    }
                  }}
                  className="px-6 py-2 rounded bg-green-600 text-white"
                >
                  Join Now
                </button>
              )}



            </div>
          );
        })}
      </div>
    );

  return (
    <section className="w-full space-y-6!">
      <div>
        <h3 className="text-3xl font-semibold">Active Meetings</h3>
        {renderCards(classified.active)}
      </div>

      <div>
        <h3 className="text-3xl font-semibold">Upcoming Meetings</h3>
        {renderCards(classified.upcoming)}
      </div>

      <div>
        <h3 className="text-3xl font-semibold">Past Meetings</h3>
        {renderCards(classified.past)}
      </div>
    </section>
  );
};

export default MeetingsList;
