"use client"

import { Loader2, ShoppingCart, Trash2 } from "lucide-react"
import { useCartStore } from "@/store/cart/useCartStore"
import { useAuth } from "@/store/auth/useAuthStore"
import { paymentsService } from "@/services/payments.service"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import { useEffect, useRef } from "react"

const POLL_INTERVAL = 5000 // 5 sec
const MAX_DURATION = 5 * 60 * 1000 // 5 minutes

export default function Cart() {
  const navigate = useNavigate()
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    items,
    subtotal,
    tax,
    total,
    removeItem,
    createOrder,
    isCreatingOrder,
    setIsCreatingOrder,
  } = useCartStore()

  const { user } = useAuth()
  if (!user) return null

  const hasItems = items.length > 0

  const getItemMeta = (item: any) => {
    if (item.type === "BUNDLE") {
      if (item.subscriptionMode === "FULL") {
        return "Full Program · One-time payment"
      }
      return `Full Program · ${item.selectedMonths} month (Monthly)`
    }

    if (item.subscriptionMode === "FULL") {
      return `${item.selectedMonths} months · One-time payment`
    }

    return `${item.selectedMonths} month · Monthly`
  }

  /* -------------------------------------------------------------------------- */
  /*                               PAYMENT POLLING                               */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
    }
  }, [])


  const pollPaymentStatus = async (orderId: string) => {
    const startTime = Date.now()

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await paymentsService.getOrderStatus(orderId)

        if (["paid", "PAID"].includes(res.data?.data?.payment?.status)) {
          clearInterval(pollTimerRef.current!)
          setIsCreatingOrder(false)

          toast.success("Payment successful 🎉")
          navigate("/")
          // window.location.href = "/student"
          return
        }

        if (Date.now() - startTime > MAX_DURATION) {
          clearInterval(pollTimerRef.current!)
          setIsCreatingOrder(false)

          toast.warning(
            "Payment verification is taking longer than usual. Please check after a few minutes or contact support."
          )
        }
      } catch {
        // silent retry
      }
    }, POLL_INTERVAL)
  }

  /* -------------------------------------------------------------------------- */
  /*                                CHECKOUT FLOW                                */
  /* -------------------------------------------------------------------------- */

  const handleCheckout = async () => {
    try {
      setIsCreatingOrder(true)

      const res = await createOrder()
      console.log(res)
      if (!res?.checkoutLink) {
        throw new Error("Invalid payment response")
      }

      // ✅ Open external browser
      if (
        typeof window !== "undefined" &&
        typeof window.api === "object" &&
        window.api !== null &&
        "openExternal" in window.api
      ) {
        ; (window.api as { openExternal: (url: string) => void })
          .openExternal(res.checkoutLink)
      } else {
        window.open(res.checkoutLink, "_blank")
      }


      toast.info("Complete payment in browser. Waiting for confirmation...")
      // ✅ Start polling
      pollPaymentStatus(res.razorpayOrderId)
    } catch (err) {
      setIsCreatingOrder(false)
      toast.error("Failed to initiate payment. Please try again.")
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/40 backdrop-blur-sm border border-purple-700/50 rounded-[8px] p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="size-10 text-violet-300" />
        <h2 className="text-3xl font-bold text-white">Your Cart</h2>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-2 py-4">
        {!hasItems && (
          <div className="text-center py-12 text-white/50">
            <p className="text-sm">No items in cart</p>
            <p className="text-xs mt-2">Select a plan to get started</p>
          </div>
        )}

        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-start gap-3 p-3 rounded-[8px] border border-white/50 hover:border-violet-500 bg-gray-900/50 transition mb-2!"
          >
            <div>
              <p className="text-base font-semibold text-white">
                {item.name}
              </p>
              <p className="text-sm text-white/60">
                {getItemMeta(item)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-violet-100">
                ₹ {item.price.toLocaleString("en-IN")}
              </span>

              <button
                onClick={() => removeItem(item._id)}
                className="text-white/40 hover:text-red-400 transition"
              >
                <Trash2 className="size-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between pt-2 text-xl border-t border-white/10">
            <span className="text-white/80">Subtotal</span>
            <span className="text-white font-semibold">
              ₹ {subtotal().toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between text-xl mb-2!">
            <span className="text-white/80">Tax (18%)</span>
            <span className="text-white font-semibold">
              ₹ {tax().toLocaleString("en-IN")}
            </span>
          </div>

          <div className="border-t border-white/10 pt-2 flex justify-between">
            <span className="text-2xl font-bold text-white">Total</span>
            <span className="text-3xl font-semibold text-white">
              ₹ {total().toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!hasItems || isCreatingOrder}
          onClick={handleCheckout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 disabled:opacity-50 py-3 rounded-[8px] text-white font-semibold mt-2!"
        >
          {isCreatingOrder && <Loader2 className="size-5 animate-spin" />}
          {isCreatingOrder ? "Waiting for payment..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  )
}
