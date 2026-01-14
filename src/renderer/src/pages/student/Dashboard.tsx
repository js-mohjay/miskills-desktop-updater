import { useAuth } from "@/store/auth/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { StudentDashboardResponse } from "@/types/student.dashboard";
import { StatCard } from "@/components/cards/StatCard";
import { Video, Upload, Briefcase, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

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

const useCareerSupportApplication = () => {
  return useQuery({
    queryKey: ["career-support-application"],
    queryFn: async () => {
      const res = await studentService.getCareerSupportApplications(1, 10, null);
      return res.data;
    },
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useStudentDashboard();

  const queryClient = useQueryClient();


  const {
    data: careerAppData,
    isLoading: isCareerAppLoading,
  } = useCareerSupportApplication();

  const [openDialog, setOpenDialog] = useState(false);

  const careerSupportMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return studentService.submitCareerSupportProfile(formData);
    },
    onSuccess: () => {
      setOpenDialog(false);

      // 🔁 Refetch dashboard data
      queryClient.invalidateQueries({
        queryKey: ["student-dashboard"],
      });

      // Optional UX feedback
      toast.success("Career support profile submitted successfully");
    },
  });


  if (isLoading) {
    return (
      <section className="w-full p-10!">
        <p className="opacity-80!">Loading dashboard…</p>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="w-full p-10!">
        <p className="text-red-500!">Failed to load dashboard</p>
      </section>
    );
  }

  const { summary, subscriptions } = data.data;
  const careerSupport = summary?.careerSupport;
  const hasCareerSupport = careerSupport?.enabled === true;
  const isProfileSubmitted = careerSupport?.isProfileSubmitted

  const applications = careerAppData?.data ?? [];

  const existingApplication =
    applications.length > 0 ? applications[0] : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    careerSupportMutation.mutate(formData);
  };

  return (
    <section className="relative w-full max-h-screen overflow-y-auto p-10! space-y-10!">
      {/* Header */}
      <button className="absolute! top-6 right-6 text-white!" onClick={() => window.api.reloadApp()}>
        <RefreshCcw className="size-8 cursor-pointer" />
      </button>

      <div>
        <h2 className="text-5xl! leading-tight!">
          Welcome {user?.name ?? ""} 👋
        </h2>
        <h4 className="text-xl! font-light! pl-1!">
          Continue your learning journey
        </h4>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6!">
        <StatCard title="Active Subscriptions" value={summary.totalSubscriptions} />
        <StatCard title="Average Progress" value={`${summary.avgProgress}%`} />
        <StatCard title="Avg Days Remaining" value={summary.avgDaysRemaining} />
        <StatCard title="Total Learning Time" value={summary.totalTimeFormatted} />
      </div>

      {/* Subscriptions */}
      <div>
        <h3 className="text-4xl! font-semibold! mb-4!">Subscriptions</h3>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6!">
          <div className="col-span-1 xl:col-span-3 flex flex-col gap-6!">

            {subscriptions.map((sub) => (
              <div
                key={sub._id}
                className="card border border-gray-400! rounded-[8px]! p-2! xl:p-6! space-y-1!"
              >
                <div className="grid grid-cols-3!">
                  <h4 className="col-span-2 text-xl! xl:text-3xl! font-semibold!">
                    <span className="font-semibold!">Course :</span>{" "}
                    {sub.subcategoryId?.name ?? "Course"}
                  </h4>
                  <span className="text-xl! xl:text-3xl!">
                    {sub.daysRemaining} days left
                  </span>
                </div>

                <p className="text-xl! xl:text-2xl! opacity-90!">
                  Progress: {sub.progress}%
                </p>

                <div className="w-full h-3! rounded-full! bg-black/70! overflow-hidden!">
                  <div
                    className="h-full! bg-violet-500!"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-lg! xl:text-xl! opacity-90!">
                  <span>
                    {sub.attendedDays}/{sub.totalDays} days attended
                  </span>
                  <span>Time Attended: {sub.attendedTimeFormatted}</span>
                </div>
              </div>
            ))}

            {/* Career Support Card */}
            {hasCareerSupport && (
              <div className="card border border-violet-500! rounded-[8px]! p-4! xl:p-6! space-y-4!">
                <div className="flex items-center gap-4!">
                  <div className="bg-violet-600/40! border border-violet-500! rounded-[8px]! p-2!">
                    <Briefcase className="size-8!" />
                  </div>
                  <h4 className="text-2xl! xl:text-3xl! font-semibold!">
                    Career Support
                  </h4>
                </div>

                {isCareerAppLoading ? (
                  <p className="opacity-80!">Loading career support status…</p>
                ) : existingApplication ? (
                  <div className="space-y-2!">
                    <p className="text-xl!">
                      ✅ Your profile has been submitted.
                    </p>
                    <p className="text-xl!">
                      Our team will contact you shortly.
                    </p>
                  </div>
                ) : !isProfileSubmitted ? (
                  <>
                    <p className="text-xl!">
                      Thanks for choosing career support.
                      Please submit your resume and our team will get back to you
                      within <strong className="font-semibold!">48 hours</strong>.
                    </p>

                    <button
                      className="btn-primary w-fit!"
                      onClick={() => setOpenDialog(true)}
                    >
                      <span>
                        Apply for Career Support
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-lg!">
                      Thanks for submitting your profile and our team will get back to you
                      within <strong className="font-semibold!">48 hours</strong>.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Virtual Classes */}
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
          </div>

          {/* Right Ads Column */}
          <div className="flex flex-col gap-6!">
            <div className="flex flex-col text-center justify-center items-center rounded-[8px]! border border-white/50! w-full! h-[200px]!">
              <h2 className="text-base!">Contact for Advertisement</h2>
              <span className="text-base!">E-Mail: <a href="mailto:contact@miskills.in">contact@miskills.in</a></span>
            </div>

            <div className="flex flex-col text-center justify-center items-center rounded-[8px]! border border-white/50! w-full! h-[400px]!">
              <h2 className="text-base!">Contact for Advertisement</h2>
              <span className="text-base!">E-Mail: <a href="mailto:contact@miskills.in">contact@miskills.in</a></span>
            </div>
          </div>
        </div>
      </div>

      {openDialog && (
        <div
          className="fixed inset-0! z-50! flex items-center justify-center bg-black/70!"
          onClick={() => setOpenDialog(false)}
        >
          <div
            className="w-full max-w-xl! rounded-[12px]! border border-white/20! bg-[#0b0b0f]! p-6! shadow-2xl!"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6!">
              <h3 className="text-2xl! font-semibold!">
                Career Support Application
              </h3>
              <button
                className="text-white/70 hover:text-white!"
                onClick={() => setOpenDialog(false)}
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-sm! text-white/70! mb-6!">
              Please submit your resume and details.
              Our team will review your profile and contact you within
              <span className="font-semibold!"> 48 hours</span>.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4!">
              {/* Resume */}
              <div className="space-y-1!">
                <label className="text-sm! text-white/80!">
                  Resume <span className="text-red-500!">*</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full! rounded-[8px]! border border-white/30! bg-black! px-3! py-2! text-sm!"
                />
              </div>

              {/* Expected Salary */}
              <div className="space-y-1!">
                <label className="text-sm! text-white/80!">
                  Expected Salary
                </label>
                <input
                  name="expectedSalary"
                  placeholder="e.g. 80000"
                  className="w-full! rounded-[8px]! border border-white/30! bg-black! px-3! py-2! text-sm!"
                  required
                />
              </div>

              {/* Experience */}
              <div className="space-y-1!">
                <label className="text-sm! text-white/80!">
                  Experience
                </label>
                <input
                  name="experience"
                  placeholder="e.g. 2 years"
                  className="w-full! rounded-[8px]! border border-white/30! bg-black! px-3! py-2! text-sm!"
                  required
                />
              </div>

              {/* Job Type */}
              <div className="space-y-1!">
                <label className="text-sm! text-white/80!">
                  Job Type
                </label>
                <input
                  name="jobType"
                  placeholder="Full Time / Internship / Remote"
                  className="w-full! rounded-[8px]! border border-white/30! bg-black! px-3! py-2! text-sm!"
                  required
                />
              </div>

              {/* Preferred Company */}
              <div className="space-y-1!">
                <label className="text-sm! text-white/80!">
                  Preferred Company
                </label>
                <input
                  name="preferredCompany"
                  placeholder="Optional"
                  className="w-full! rounded-[8px]! border border-white/30! bg-black! px-3! py-2! text-sm!"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3! pt-6!">
                <button
                  type="button"
                  className="px-4! py-2! rounded-[8px]! border border-white/30! text-sm!"
                  onClick={() => setOpenDialog(false)}
                  disabled={careerSupportMutation.isPending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5! py-2! rounded-[8px]! bg-violet-600! hover:bg-violet-700! text-sm! font-semibold!"
                  disabled={careerSupportMutation.isPending}
                >
                  {careerSupportMutation.isPending
                    ? "Submitting…"
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default Dashboard;
