import api from "@/lib/axios";
import { CreateSubscriptionPayload } from "@/types/payment";

export const paymentsService = {
  createSubscriptionOrder: (payload: CreateSubscriptionPayload, client: "DESKTOP") => {
    return api.post(`/api/payments/create-subscription-payment`, {...payload, client: client});
  },

  verifyPayment: (payload: {paymentId: string, razorpayPaymentId: string, razorpaySignature: string }) => {
    console.log('verifying payment')
    return api.post(`/api/payments/verify-subscription-payment`, payload);
  },

  getOrderStatus: (orderId: string) => {
    return api.get(`/api/payments/status/${orderId}`)
  }

}
