import api from "../lib/axios"

export type onboardPayload = {
  college: string;
  phoneNumber: string;
  avatar?: string;
  name: string;
  email: string,
  dob: string;
  city: string;
  state: string,
  otp ?: string
}

export const userService = {
  getProfile: () => {
    return api.get("/api/user/profile");
  },
  setCollege: (payload: onboardPayload) => {
    return api.post("/api/user/set-college", payload);
  }
}
