"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { userService } from "@/services/user.service"
import {
  UpdateProfilePayload,
  GetProfileResponse,
} from "@/types/user"
import { Loader2 } from "lucide-react"

export default function ProfileForm() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<GetProfileResponse>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await userService.getProfile()
      return res.data
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateProfilePayload>()

  useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.name,
        phone: data.user.phoneNumber,
        bio: data.user.bio,
        address: data.user.address,
        college: data.user.college,
      })
    }
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),
    onSuccess: () => {
      toast.success("Profile updated successfully")
      qc.invalidateQueries({ queryKey: ["profile"] })
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })

  const onSubmit = (formData: UpdateProfilePayload) => {
    mutation.mutate(formData)
  }

  if (isLoading) {
    return <div className="h-56 bg-white/10 rounded-[8px]" />
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8!"
    >
      {/* -------- BASIC INFO -------- */}
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/60">Name</label>
          <input
            {...register("name")}
            className="h-11 px-3 rounded-[8px] bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/60 transition"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-white/60">Phone</label>
          <input
            {...register("phone")}
            className="h-11 px-3 rounded-[8px] bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/60 transition"
          />
        </div>
      </div>

      {/* -------- COLLEGE -------- */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-white/60">College</label>
        <input
          {...register("college")}
          className="h-11 px-3 rounded-[8px] bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/60 transition"
        />
      </div>

      {/* -------- ADDRESS -------- */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-white/60">Address</label>
        <input
          {...register("address")}
          className="h-11 px-3 rounded-[8px] bg-white/5 border border-white/10 text-white outline-none focus:border-violet-500/60 transition"
        />
      </div>

      {/* -------- BIO -------- */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-white/60">Bio</label>
        <textarea
          {...register("bio")}
          rows={4}
          placeholder="Tell us a little about yourself…"
          className="px-3 py-2 rounded-[8px] bg-white/5 border border-white/10 text-white resize-none outline-none focus:border-violet-500/60 transition"
        />
      </div>

      {/* -------- DIVIDER -------- */}
      <div className="h-px bg-white/10" />

      {/* -------- ACTIONS -------- */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="
            btn-primary
            min-w-[180px]
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          <span className="flex items-center justify-center gap-2">
            {mutation.isPending ? (
              <>
                <Loader2 className="spin size-6" />
              </>
            ) : (
              "Save Changes"
            )}
          </span>
        </button>

      </div>
    </form>
  )
}
