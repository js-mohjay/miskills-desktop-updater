import { useAuth } from "@/store/auth/useAuthStore";

import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { StudentDashboardResponse } from "@/types/student.dashboard";
import { StatCard } from "@/components/cards/StatCard";
import RealEstate from "@/assets/ads/realEstate.png"
// import AdVideo from "@/assets/ads/ad-video.mp4"
import { Video } from "lucide-react";
import { useNavigate } from "react-router";

const useStudentDashboard = () => {
  return useQuery<StudentDashboardResponse>({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      const res = await studentService.getDashboard();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  const { data, isLoading, isError } = useStudentDashboard();

  if (isLoading) {
    return (
      <section className="w-full p-10">
        <p className="opacity-80">Loading dashboard…</p>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="w-full p-10">
        <p className="text-red-500">Failed to load dashboard</p>
      </section>
    );
  }

  const { summary, subscriptions } = data.data;

  return (
    <section className="w-full max-h-screen overflow-y-auto p-10 space-y-10!">
      {/* Header */}
      <div>
        <h2 className="text-5xl leading-tight">
          Welcome {user?.name ?? ""} 👋
        </h2>
        <h4 className="text-xl font-light! pl-1">
          Continue your learning journey
        </h4>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Active Subscriptions"
          value={summary.totalSubscriptions}
        />
        <StatCard
          title="Average Progress"
          value={`${summary.avgProgress}%`}
        />
        <StatCard
          title="Avg Days Remaining"
          value={summary.avgDaysRemaining}
        />
        <StatCard
          title="Total Learning Time"
          value={summary.totalTimeFormatted}
        />
      </div>

      {/* Subscriptions */}
      <div>
        <h3 className="text-4xl font-semibold mb-4!">
          Subscriptions
        </h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          <div className={"col-span-1 xl:col-span-3 flex flex-col gap-6"}>
            {subscriptions.map((sub) => (
              <div
                key={sub._id}
                className="card border border-gray-400! rounded-[8px] p-2! xl:p-6! space-y-1!"
              >
                <div className="grid grid-cols-3">
                  <h4 className="col-span-2 text-xl xl:text-3xl font-semibold">
                    <span className={"font-semibold!"}>Course : </span>{sub.subcategoryId.name}
                  </h4>
                  <span className="text-xl xl:text-3xl">
                    {sub.daysRemaining} days left
                  </span>
                </div>

                <p className="text-xl xl:text-2xl opacity-90">
                  Progress: {sub.progress}%
                </p>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-black/70 overflow-hidden">
                  <div
                    className="h-full bg-violet-500"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-lg xl:text-xl opacity-90">
                  <span>
                    {sub.attendedDays}/{sub.totalDays} days attended
                  </span>
                  <span>Time Attended: {sub.attendedTimeFormatted}</span>
                </div>
              </div>
            ))}
            <div className={"card border border-white/50 rounded-[8px]! grid! grid-cols-6! justify-between items-center p-4! xl:p-6"}>

              <div className={"bg-violet-600/40 border border-violet-500 rounded-[8px] h-fit w-fit p-2"}>
                <Video className={"size-7! xl:size-10!"} />
              </div>

              <div className={"col-span-3 flex flex-col gap-2"}>
                <div className={"text-xl md:text-2xl xl:text-3xl"}>
                  Virtual Classes
                </div>
                <div className={"text-base! xl:text-xl"}>
                  Join live sessions with instructors
                </div>
              </div>

              <div className={"col-span-2"}>
                <button className={"btn-primary w-full! max-w-full! text-sm! xl:text-xl!"} onClick={() => navigate('/student/meetings')}>
                  <span>
                    Join a session
                  </span>
                </button>
              </div>

            </div>
            <div className={"rounded-[8px]!"}>
              <div className="flex flex-col justify-center items-center rounded-[8px] border border-white/50 w-full! h-[400px]!">
                <h2 className="text-xl!">
                  Contact for Video Advertisement
                </h2>
                <br />
                <span className="text-xl!">
                  E-Mail: contact@miskills.in
                </span>
              </div>
              {/* <iframe
                src="https://www.youtube.com/embed/oYmU8Av_e84?autoplay=1&mute=1&loop=1&playlist=oYmU8Av_e84&controls=0&rel=0"
                title="Advertisement video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full aspect-video rounded-[8px] border border-white/50"
              /> */}
            </div>
          </div>

          {/* advertisement */}
          <div className={"flex flex-col gap-6"}>
            {/*<video*/}
            {/*  src={"https://www.youtube.com/embed/kYOP52BUZTI?si=KkQRmFlqd15vXKB5"}*/}
            {/*  autoPlay*/}
            {/*  muted*/}
            {/*  loop*/}
            {/*  playsInline*/}
            {/*  controls={false}*/}
            {/*  className="w-full rounded-[8px] border border-white/50"*/}
            {/*/>*/}

            {/* <iframe
              src="https://www.youtube.com/embed/kYOP52BUZTI?autoplay=1&mute=1&loop=1&playlist=kYOP52BUZTI&controls=0&rel=0"
              title="Advertisement video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full aspect-video rounded-[8px] border border-white/50"
            /> */}

            <div className="flex flex-col justify-center items-center rounded-[8px] border border-white/50 w-full! h-[200px]!">
              <h2 className="text-lg!">
                Contact for Video Advertisement
              </h2>
              <br />
              <span className="text-lg!">
                E-Mail: contact@miskills.in
              </span>
            </div>


            <div className="flex flex-col justify-center items-center rounded-[8px] border border-white/50 w-full! h-[400px]!">
              <h2 className="text-lg!">
                Contact for Advertisement
              </h2>
              <br />
              <span className="text-lg!">
                E-Mail: contact@miskills.in
              </span>
            </div>
            {/* <img src={RealEstate} alt="" className={"w-full! rounded-[8px] border border-white/50 "} /> */}




          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

