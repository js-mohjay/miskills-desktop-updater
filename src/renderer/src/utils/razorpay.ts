// utils/razorpay.ts

type RazorpayPrefill = {
  name: string;
  email: string;
  contact: string;
};

type RazorpayOptionsInput = {
  key?: string;          // 👈 optional
  amount: number;        // in paise
  currency?: string;
  name?: string;         // 👈 optional
  description?: string;
  image?: string;
  orderId: string;
  prefill: RazorpayPrefill;
  notes?: Record<string, string>;
  themeColor?: string;
  redirect?: boolean;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
};


export function openRazorpayCheckout({
  key = import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount,
  currency = "INR",
  name = "Mohjay Infotech Pvt Ltd",
  description = "Subscription Checkout",
  image = "http://localhost:5173/src/assets/logo-white.png",
  orderId,
  prefill,
  notes,
  redirect = true,
  themeColor = "#3399cc",
  onSuccess,
  onFailure,
  onDismiss,
}: RazorpayOptionsInput) {
  const options = {
    key,
    amount: amount.toString(),
    currency,
    name,
    description,
    image,
    order_id: orderId,
    redirect,
    handler: function (response: any) {
      onSuccess?.(response);
    },
    modal: {
      ondismiss: function () {
        onDismiss?.()
      },
    },

    prefill,
    notes,

    theme: {
      color: themeColor,
    },
  };

  console.log('razorpay options', options)

  const razorpay = new (window as any).Razorpay(options);

  razorpay.on("payment.failed", function (response: any) {
    onFailure?.(response.error);
  });

  razorpay.open();
}
