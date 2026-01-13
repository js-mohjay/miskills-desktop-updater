"use client"

import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { CircleCheck, CircleCheckBig, MoveLeft, Star } from "lucide-react"
import Cart from "@/components/Cart"
import { categoryService } from "@/services/category.service";
import { useCartStore } from "@/store/cart/useCartStore"
import { useState } from "react";
import { studentService } from "@/services/student.service"
import { useAuth } from "@/store/auth/useAuthStore"


export default function SubCategories({ category, onBack }: Props) {

  const user = useAuth((s) => s.user)

  const { data: subscriptionsData = [] } = useQuery({
    queryKey: ["student-subscriptions-array", user?._id],
    enabled: !!user,
    queryFn: () => studentService.getSubscriptions(1, 50),
    select: (res) => Array.isArray(res.data?.data) ? res.data.data : [],
  });



  const isSubscribedSubcategory = (subcategoryId: string) => {
  return subscriptionsData.some(
    (sub: any) =>
      sub.subcategoryId?._id === subcategoryId &&
      sub.status === "active"
  );
};



  const [selectedBundle, setSelectedBundle] = useState<{
    id: string | null;
    subscriptionMode: "FULL" | "MONTHLY" | null;
    selectedMonths: number | null
  }>({ id: null, selectedMonths: null, subscriptionMode: null })

  type IndividualSelection = {
    id: string
    subscriptionMode: "FULL" | "MONTHLY"
    selectedMonths: number
  }

  const [selectedIndividuals, setSelectedIndividuals] = useState<IndividualSelection[]>([])


  const getSelectedIndividual = (id: string) =>
    selectedIndividuals.find(i => i.id === id)

  const isIndividualSelected = (id: string) =>
    selectedIndividuals.some(i => i.id === id)


  const {
    items,
    addItem,
    // removeItem,
    clearCart,
  } = useCartStore()


  const bundleItem = items.find(i => i.type === "BUNDLE")

  const handleAddBundle = (sub: any) => {
    const isSameBundle = selectedBundle.id === sub._id
    const hasMode = !!selectedBundle.subscriptionMode
    const isMonthly = selectedBundle.subscriptionMode === "MONTHLY"
    const hasValidMonths =
      typeof selectedBundle.selectedMonths === "number" &&
      selectedBundle.selectedMonths > 0

    if (!isSameBundle || !hasMode || (isMonthly && !hasValidMonths)) {
      toast.error("Please select a payment option")
      return
    }

    clearCart()

    const selectedMonths = selectedBundle.selectedMonths ?? 0

    addItem({
      _id: sub._id,
      name: sub.name,
      type: "BUNDLE",
      billingType: sub.billingType,
      subscriptionMode: selectedBundle.subscriptionMode!,
      selectedMonths,
      price:
        selectedBundle.subscriptionMode === "FULL"
          ? sub.totalPrice
          : sub.monthlyPrice * selectedMonths,
    })
  }





  const handleAddIndividual = (sub: any) => {
    const selection = getSelectedIndividual(sub._id)

    if (!selection) {
      toast.error("Please select a payment option")
      return
    }

    if (bundleItem) {
      toast.error("You can only select either bundle or individual plans, Please remove any bundles before adding individual plans to your cart.")
    }

    addItem({
      _id: sub._id,
      name: sub.name,
      type: "INDIVIDUAL",
      billingType: sub.billingType,
      subscriptionMode: selection.subscriptionMode,
      selectedMonths: selection.selectedMonths,
      price:
        selection.subscriptionMode === "FULL"
          ? sub.totalPrice
          : sub.monthlyPrice * selection.selectedMonths,
    })
  }


  const isInCart = (id: string) =>
    items.some((item) => item._id === id)


  const { data, isLoading, error } = useQuery({
    queryKey: ["subcategories", category._id],
    queryFn: async () => {
      const res = await categoryService.getSubcategories(category._id)
      return res.data
    },
  })

  if (error) {
    toast.error("Failed to load sub-categories")
  }

  if (isLoading) {
    return <div className="text-white">Loading plans…</div>
  }

  // console.log("subcategory data", data)




  return (
    <div className="w-full max-w-[90vw] h-screen overflow-hidden">
      <div className={"w-full px-8 py-4!"}>
        <button
          onClick={() => {
            clearCart()
            onBack()
          }
          }
          className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <MoveLeft className="size-6 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-semibold">Back</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 w-full h-full max-h-[90vh]">
        <div className="col-span-9 text-white space-y-8! px-8 h-full overflow-y-auto">
          <div
            className="rounded-[8px] border border-white/50 hover:border-violet-500/50 bg-gradient-to-br from-violet-950/60 to-gray-800/60 backdrop-blur-sm">
            {/*<div className="card__border w-full h-full"></div>*/}
            <div className="card_title__container text-center py-8 px-6">
              <h1
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-100 to-white bg-clip-text text-transparent">
                {category?.name}
              </h1>
            </div>
            <hr className="line opacity-30" />
            <div className="flex flex-wrap gap-6 justify-center items-center py-6 px-4">
              {data?.categoryBenefits &&
                data?.categoryBenefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 items-center text-white">
                    <CircleCheckBig className="size-5 text-violet-300 flex-shrink-0" />
                    <span className="text-base font-medium">{benefit}</span>
                  </div>
                ))}
            </div>
          </div>

          {data?.bundles && Array.isArray(data.bundles) && data.bundles.length > 0 && (
            <>
              <div className="flex items-center gap-6 my-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/50 to-violet-400/50"></div>
                <h2 className="text-3xl font-bold tracking-wide text-white whitespace-nowrap">COMPLETE PLAN</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-violet-400/50 to-violet-400/50"></div>
              </div>

              <div className="space-y-6">
                {data?.bundles?.map((sub: any) => {
                  const isSubscribed = isSubscribedSubcategory(sub._id)
                  return (
                    <div
                      key={sub._id}
                      className="rounded-[8px] border border-white/50 hover:border-violet-500/50 bg-gradient-to-br from-violet-950/60 to-gray-800/60 backdrop-blur-sm  transition-all duration-300 group overflow-hidden"
                    >

                      <div className="p-6! pb-4">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-3xl font-bold text-white flex-1">{sub.name}</h3>
                          <div className="flex gap-2">
                            {sub?.durationMonths > 0 && (
                              <>
                                <span
                                  className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-base! text-white font-semibold whitespace-nowrap">
                                  {sub.durationMonths} Months
                                </span>
                                <span
                                  className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-base font-semibold flex items-center gap-1">
                                  <Star className="size-3 fill-amber-300" />
                                  Popular
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed mb-4">{sub.description}</p>

                        {/*<div className="flex items-center gap-6 text-base text-white/60">*/}
                        {/*  <div className="flex items-center gap-2">*/}
                        {/*    <Clock className="size-4 text-violet-400" />*/}
                        {/*    <span>50+ hours</span>*/}
                        {/*  </div>*/}
                        {/*  <div className="flex items-center gap-2">*/}
                        {/*    <Users className="size-4 text-violet-400" />*/}
                        {/*    <span>1,200+ enrolled</span>*/}
                        {/*  </div>*/}
                        {/*</div>*/}


                      </div>

                      <hr className="line opacity-20" />

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 py-4 px-6">
                        {sub?.benefits?.map((benefit: string, index: number) => (
                          <div key={index} className="flex gap-3 items-start">
                            <CircleCheck className="size-5 text-violet-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white/90 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <hr className="line opacity-20" />

                      <div className="p-6! flex items-center gap-2">

                        {/* MONTHLY OPTION (only if available) */}
                        {sub.billingType === "MONTHLY" && sub.monthlyPrice && (
                          <label
                            className="flex-1 flex items-center justify-between px-5 py-2 border-2 border-purple-700/50 bg-gradient-to-r from-purple-900/40 to-purple-800/30 hover:border-purple-600 hover:from-purple-900/60 hover:to-purple-800/50 cursor-pointer has-[:checked]:border-violet-100 has-[:checked]:from-violet-600/30 has-[:checked]:to-violet-700/30 has-[:checked]:shadow-lg has-[:checked]:shadow-violet-500/20 rounded-[8px]! transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`bundle-${sub._id}`}
                                className="w-4 h-4 accent-violet-500 cursor-pointer"

                                disabled={isSubscribed ?? false}

                                checked={
                                  selectedBundle.id === sub._id &&
                                  selectedBundle?.subscriptionMode === "MONTHLY"
                                }

                                onChange={() =>
                                  setSelectedBundle({
                                    id: sub._id,
                                    subscriptionMode: "MONTHLY",
                                    selectedMonths: 1,
                                  })
                                }


                              />
                              <span className="text-base font-medium text-white">Monthly Payment</span>
                            </div>

                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-lg font-bold text-violet-300">
                                ₹ {sub.monthlyPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </label>
                        )}


                        <label
                          className="flex-1 flex items-center justify-between px-5 py-2 border-2 border-purple-700/50 bg-gradient-to-r from-purple-900/40 to-purple-800/30 hover:border-purple-600 hover:from-purple-900/60 hover:to-purple-800/50 cursor-pointer has-[:checked]:border-violet-100 has-[:checked]:from-violet-600/30 has-[:checked]:to-violet-700/30 has-[:checked]:shadow-lg has-[:checked]:shadow-violet-500/20 rounded-[8px]! transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`bundle-${sub._id}`}
                              className="w-4 h-4 accent-violet-500 cursor-pointer"
                              id={`bundle-${sub._id}`}

                              disabled={isSubscribed ?? false}

                              checked={
                                selectedBundle.id === sub._id &&
                                selectedBundle?.subscriptionMode === "FULL"
                              }

                              onChange={() =>
                                setSelectedBundle({
                                  id: sub._id,
                                  subscriptionMode: "FULL",
                                  selectedMonths: sub.durationMonths,
                                })
                              }


                            />
                            <span className="text-base font-medium text-white">Full Payment</span>
                          </div>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg font-bold text-violet-300">
                              ₹ {sub.totalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </label>

                        <button
                          onClick={() => {
                            console.log(selectedBundle.id, sub._id, selectedBundle.selectedMonths, selectedBundle.subscriptionMode)

                            if (isSubscribed) {
                              toast.info("Plan already subscribed.")
                              return
                            }

                            if (selectedBundle.id !== sub._id) {
                              toast.error("Please select a payment option first")
                              return
                            }

                            handleAddBundle(sub)
                          }}
                          className={`
                            btn-primary h-full! whitespace-nowrap transition-all duration-200
                          ${isSubscribed ? "bg-gray-500! hover:bg-gray-600! cursor-not-allowed" : selectedBundle.id !== sub._id
                              ? "bg-gray-500! cursor-not-allowed"
                              : "hover:shadow-lg hover:shadow-violet-500/30"
                            }
                          `}
                        >
                          <span className="px-5! py-2! max-h-[98%]">
                            {isSubscribed ? "Subscribed" : isInCart(sub._id) ? "Selected" : "Add to Cart"}
                          </span>
                        </button>


                      </div>
                    </div>
                  )
                }
                )}
              </div>
            </>
          )}


          {/* INDIVIDUAL COURSES */}

          {data?.individualCourses && Array.isArray(data.individualCourses) && data.individualCourses.length > 0 && (
            <>
              <div className="flex items-center gap-6 my-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-400/30 to-violet-400/30"></div>
                <h2 className="text-2xl font-semibold tracking-wide text-white whitespace-nowrap text-center">
                  OR SELECT FROM INDIVIDUAL PLANS
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-violet-400/30 to-violet-400/30"></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {data?.individualCourses?.map((sub: any) => {

                  const isSubscribed = isSubscribedSubcategory(sub._id)

                  return (
                    <div
                      key={sub._id}
                      className="flex flex-col gap-4! rounded-[8px] border border-white/50 hover:border-violet-500/50 bg-gradient-to-br from-violet-950/60 to-gray-800/60 backdrop-blur-sm  transition-all duration-300 group overflow-hidden p-6!"
                    >
                      <div>
                        <h3 className="text-2xl font-bold text-center mb-3 text-white">{sub.name}</h3>
                        <p className="text-sm text-white/70 text-center leading-relaxed">{sub.description}</p>
                      </div>

                      <hr className="line opacity-20" />

                      <div className="flex flex-col gap-3 py-4 px-6 flex-grow">
                        {sub?.benefits?.map((benefit: string, index: number) => (
                          <div key={index} className="flex gap-3 items-start">
                            <CircleCheck className="size-5 text-violet-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white/90 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <hr className="line opacity-20" />

                      <div>
                        <legend className="text-base font-semibold text-violet-200 mb-2!">
                          Choose your Payment Plan
                        </legend>

                        {/* MONTHLY OPTION (only if available) */}
                        {sub.billingType === "MONTHLY" && sub.monthlyPrice && (
                          <label
                            className="flex-1 flex items-center justify-between px-5 py-2 border-2 border-purple-700/50 bg-gradient-to-r from-purple-900/40 to-purple-800/30 hover:border-purple-600 hover:from-purple-900/60 hover:to-purple-800/50 cursor-pointer has-[:checked]:border-violet-100 has-[:checked]:from-violet-600/30 has-[:checked]:to-violet-700/30 has-[:checked]:shadow-lg has-[:checked]:shadow-violet-500/20 rounded-[8px]! transition-all duration-200 mb-2!"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`individualCourse-${sub._id}`}
                                className="w-4 h-4 accent-violet-500 cursor-pointer"

                                disabled={isSubscribed ?? false}

                                checked={
                                  getSelectedIndividual(sub._id)?.subscriptionMode === "MONTHLY"
                                }
                                onChange={() => {
                                  setSelectedIndividuals(prev => [
                                    ...prev.filter(i => i.id !== sub._id),
                                    {
                                      id: sub._id,
                                      subscriptionMode: "MONTHLY",
                                      selectedMonths: 1,
                                    },
                                  ])
                                }}


                              />
                              <span className="text-base font-medium text-white">Monthly Payment</span>
                            </div>

                            <div className="flex items-baseline gap-2 flex-wrap">
                              {/* <span className="text-base font-semibold text-white">1 Month</span>
                              <span className="text-white/50">•</span> */}
                              <span className="text-lg font-bold text-violet-300">
                                ₹ {sub.monthlyPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </label>
                        )}


                        <label
                          className="flex-1 flex items-center justify-between px-5 py-2 border-2 border-purple-700/50 bg-gradient-to-r from-purple-900/40 to-purple-800/30 hover:border-purple-600 hover:from-purple-900/60 hover:to-purple-800/50 cursor-pointer has-[:checked]:border-violet-100 has-[:checked]:from-violet-600/30 has-[:checked]:to-violet-700/30 has-[:checked]:shadow-lg has-[:checked]:shadow-violet-500/20 rounded-[8px]! transition-all duration-200 mb-2!"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`individualCourse-${sub._id}`}
                              className="w-4 h-4 accent-violet-500 cursor-pointer"
                              id={sub._id}

                              disabled={isSubscribed ?? false}

                              checked={
                                getSelectedIndividual(sub._id)?.subscriptionMode === "FULL"
                              }
                              onChange={() => {
                                setSelectedIndividuals(prev => [
                                  ...prev.filter(i => i.id !== sub._id),
                                  {
                                    id: sub._id,
                                    subscriptionMode: "FULL",
                                    selectedMonths: sub.durationMonths,
                                  },
                                ])
                              }}


                            />
                            <span className="text-base font-medium text-white">{sub.durationMonths} Months</span>

                          </div>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {/* <span className="text-base font-semibold text-white">{sub.durationMonths} Months</span>
                            <span className="text-white/50">•</span> */}
                            <span className="text-lg font-bold text-violet-300">
                              ₹ {sub.totalPrice.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </label>
                      </div>


                      <button
                        onClick={() => {

                          if (isSubscribed) {
                            toast.info("Plan already subscribed.")
                            return
                          }

                          if (!isIndividualSelected(sub._id)) {
                            toast.error("Please select a payment option first")
                            return
                          }
                          handleAddIndividual(sub)
                        }}
                        className={`btn-primary w-full rounded-xl py-3 font-semibold transition-all duration-200 mt-auto
                          ${isSubscribed ? "bg-gray-500! hover:bg-gray-600! cursor-not-allowed" : !isIndividualSelected(sub._id)
                            ? "bg-gray-500! cursor-not-allowed!"
                            : "bg-gradient-to-r from-violet-600/80 to-purple-600/80 hover:from-violet-500 hover:to-purple-500 hover:shadow-lg hover:shadow-violet-500/20"
                          }
                        `}
                      >
                        <span>{isSubscribed ? "Subscribed" : isInCart(sub._id) ? "Selected" : "Select Plan"}</span>
                      </button>


                    </div>

                  )
                }
                )}
              </div>
            </>
          )}
        </div>

        <div className="col-span-3 h-full pr-4!">
          <Cart />
        </div>


      </div>
    </div>
  )
}

type Props = {
  category: {
    _id: string
    name: string
  }
  onBack: () => void
}
