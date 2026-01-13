import api from "../lib/axios"

export const mailService = {
  sendOTP: (email: string) => {
    return api.post("/api/mail/send-otp", {email})
  },

  verifyEmail: (email: string, otp: string) => {
    return api.post("/api/mail/verify-email", {email, otp})
  },
}
