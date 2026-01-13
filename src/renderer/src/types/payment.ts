// payments.types.ts

export type MonthlySameMonthsPayload = {
  subscriptionMode: "MONTHLY"
  subcategories: string[]
  selectedMonths: number
}

export type MonthlyDifferentMonthsPayload = {
  subscriptionMode: "MONTHLY"
  subcategories: {
    subcategoryId: string
    months: number
  }[]
}

export type FullBundlePayload = {
  subscriptionMode: "FULL"
  subcategories: string[] // always one bundle id
}

export type CreateSubscriptionPayload =
  | MonthlySameMonthsPayload
  | MonthlyDifferentMonthsPayload
  | FullBundlePayload



export type CreateSubscriptionOrderResponse = {
  success: true
  paymentId: string
  razorpayOrderId: string
  checkoutLink: string
  amount: string
  currency: string
}
