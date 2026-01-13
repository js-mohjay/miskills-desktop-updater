import api from "@/lib/axios";

export const authApi = {
  sendOtp: (identifier: string) =>
    api.post("/api/auth/login-v2", { identifier }),

  verifyOtp: (identifier: string, otp: string) =>
    api.post("/api/auth/login-v2/verify-otp", { identifier, otp }),

  //signup

  signup: (payload: { name: string, phoneNumber: string, role: string, deviceToken: string }) => {
    return api.post("/api/auth/signup-v2", payload)
  },

  verifySignupOtp: (phoneNumber: string, otp: string) => {
    return api.post("/api/auth/signup-v2/verify-otp", { phoneNumber, otp })
  },


  //Employee  Login:

  employeeSendOtp: (email: string) => {
    return api.post("/api/auth/send-admin-otp", { email })
  },

  employeeVerifyOtp: (email: string, otp: string) => {
    return api.post("/api/auth/verify-admin-otp", {email, otp})
  },

};
