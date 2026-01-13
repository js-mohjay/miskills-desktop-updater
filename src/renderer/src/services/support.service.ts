import api from "@/lib/axios"
import { SendSupportPayload } from "@/types/support"


export const supportService = {
  send: (payload: SendSupportPayload) => {
    return api.post("/api/mail/send", payload)
  },
}
