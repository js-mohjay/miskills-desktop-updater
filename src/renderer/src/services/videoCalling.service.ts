import {vcApi} from "@/lib/axios";

const platformId = import.meta.env.VITE_PLATFORM_ID || "miskills"

export const videoCallingService = {
  getParticipantMeetings: (participantId: string) => {
      return vcApi.get(`/schedule/occurrence/participant?platformId=${platformId}&participantId=${participantId}`)
  }
}
