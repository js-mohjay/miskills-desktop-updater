"use client"

import JewelleryPortraitAd from "@/assets/ads/jwelleryPortrait.png"
import { useState } from "react"
import { Calendar, ChartNoAxesCombined, Clock8 } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { studentService } from "@/services/student.service"

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type Pricing = {
  totalPrice: number
  gstPercent: number
  currency: string
  monthlyPrice: number | null
}

type Learning = {
  id: string
  category: string
  subcategory: string
  subcategoryId: string
  startDate: string
  endDate: string
  status: "active" | "inactive"
  isActive: boolean
  pricing: Pricing
  dailyHours: number
  renewalCount: number
}

type LearningsResponse = {
  success: boolean
  message: string
  data: Learning[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}

/* -------------------------------------------------------------------------- */
/*                               HELPER UTILS                                 */
/* -------------------------------------------------------------------------- */

const getDurationDays = (start: string, end: string) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = endDate.getTime() - startDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB")

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const Learning = () => {
  const [selectedLearning, setSelectedLearning] = useState<Learning | null>(null)

  const navigate = useNavigate()

  const page = 1
  const limit = 25

  const { data, isLoading, isError } = useQuery<LearningsResponse>({
    queryKey: ["student-learnings", page, limit],
    queryFn: async () => {
      const res = await studentService.getLearnings(page, limit)
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })

  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  if (isLoading) {
    return (
      <section className="w-full min-h-screen p-10 flex items-center justify-center">
        <p className="text-xl text-white/70">Loading your subscriptions...</p>
      </section>
    )
  }

  if (isError || !data?.success) {
    return (
      <section className="w-full min-h-screen p-10 flex items-center justify-center">
        <p className="text-xl text-red-400">
          Failed to load subscriptions
        </p>
      </section>
    )
  }

  const learnings = data.data

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <section className="w-full min-h-screen overflow-auto p-10 space-y-6!">
      <div>
        <h1 className="text-5xl leading-tight">My Subscriptions</h1>
        <h3 className="text-xl font-light! pl-0.5">
          Track your learning progress
        </h3>
      </div>

      <div className="mt-8!">
        {!selectedLearning ? (
          <div className="grid grid-cols-4 gap-3">
            {/* ---------------------------- LEFT ---------------------------- */}
            <div className="col-span-3! flex flex-col gap-6">
              {learnings.length === 0 && (
                <p className="text-xl text-white/70 text-center">
                  You don’t have any active subscriptions yet.
                </p>
              )}

              {learnings.map((learning) => {
                const durationDays = getDurationDays(
                  learning.startDate,
                  learning.endDate
                )

                return (
                  <div
                    key={learning.id}
                    className="card p-0! border border-white/50 rounded-[8px] grid! grid-cols-2! w-full! h-fit! gap-3!"
                  >
                    <div className="col-span-2 flex flex-col gap-2">
                      <div className="w-full grid grid-rows-3">
                        {/* Header */}
                        <div className="row-span-1 border-b-2 border-white/40 p-4 px-10 pr-10.5! flex justify-between items-center">
                          <h2 className="text-xl 2xl:text-3xl text-white">
                            <strong className="font-semibold!">
                              Course :
                            </strong>{" "}
                            {learning.subcategory}
                          </h2>

                          <div className="relative text-xl! border border-emerald-600 bg-emerald-800/60 rounded-[8px]! px-2 py-1 flex justify-center items-center! gap-2! capitalize">
                            <span className="h-3! w-3! bg-emerald-600 rounded-full" />
                            {learning.status}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="row-span-2 w-full px-10 py-4 flex justify-center items-center">
                          <div className="grid grid-cols-3 w-full">
                            <div className="col-span-2 flex flex-wrap gap-6 2xl:gap-10">
                              <div className="flex flex-col gap-1 items-center justify-center">
                                <Calendar className="size-7" />
                                <p className="text-base 2xl:text-xl">
                                  {durationDays} Days
                                </p>
                                <p className="text-sm">Duration</p>
                              </div>

                              <div className="flex flex-col gap-1 items-center justify-center">
                                <Clock8 className="size-7" />
                                <p className="text-base 2xl:text-xl">
                                  {learning.dailyHours} h / day
                                </p>
                                <p className="text-sm">Daily Time</p>
                              </div>

                              <div className="flex flex-col gap-1 items-center justify-center">
                                <ChartNoAxesCombined className="size-7" />
                                <p className="text-base 2xl:text-xl">0%</p>
                                <p className="text-sm">Completed</p>
                              </div>
                              <div className="min-w-1/2 flex gap-6">
                                {/* starts and ends */}
                                <div className="flex 2xl:flex-col gap-1 2xl:justify-center">
                                  <p className="text-base 2xl:text-lg">Starts:</p>
                                  <p className="text-base 2xl:text-xl">
                                    {formatDate(learning.startDate)}
                                  </p>
                                </div>

                                <div className="flex 2xl:flex-col gap-1 2xl:justify-center">
                                  <p className="text-base 2xl:text-lg">Ends:</p>
                                  <p className="text-base 2xl:text-xl">
                                    {formatDate(learning.endDate)}
                                  </p>
                                </div>
                              </div>


                            </div>

                            <div className="col-span-1 flex justify-center items-center">
                              <button
                                className="btn-primary w-fit!"
                                onClick={() =>
                                  navigate(`/student/learning/${learning.subcategoryId}`, {
                                    state: { subscriptionId: learning.id },
                                  })
                                }
                              >
                                <span>
                                  View Details
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-center">
                <p className="text-xl text-white/70">
                  Want to explore more courses?{" "}
                  <Link
                    to="/student/courses"
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-4 transition"
                  >
                    Browse our courses and enroll
                  </Link>
                </p>
              </div>
            </div>

            {/* ---------------------------- RIGHT ---------------------------- */}
            <div className="flex flex-col gap-6">
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

              <div className={"rounded-[8px]!"}>
                <div className="flex flex-col justify-center items-center rounded-[8px] border border-white/50 w-full! h-[400px]!">
                  <h2 className="text-lg!">
                    Contact for Advertisement
                  </h2>
                  <br />
                  <span className="text-lg!">
                    E-Mail: contact@miskills.in
                  </span>
                </div>
              </div>
              {/* <img
                src={JewelleryPortraitAd}
                alt=""
                className="w-full! rounded-[8px] border border-white/50"
              /> */}
            </div>
          </div>
        ) : (
          <div>
            <button
              className="mb-6 text-violet-400 underline"
              onClick={() => setSelectedLearning(null)}
            >
              ← Back to Learnings
            </button>

            <h2 className="text-4xl">
              {selectedLearning.subcategory}
            </h2>
          </div>
        )}
      </div>
    </section>
  )
}

export default Learning
