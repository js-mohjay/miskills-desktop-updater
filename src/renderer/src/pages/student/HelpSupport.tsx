"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader2, Mail, Phone, MessageSquare } from "lucide-react"

import { supportService } from "@/services/support.service"
import { useAuth } from "@/store/auth/useAuthStore"

/* -------------------------------------------------------------------------- */
/*                                    SCHEMA                                  */
/* -------------------------------------------------------------------------- */

const supportSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  description: z.string().min(10, "Please describe your issue"),
})

type SupportFormValues = z.infer<typeof supportSchema>

/* -------------------------------------------------------------------------- */

export default function HelpSupport() {
  const user = useAuth((s) => s.user)

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      description: "",
    },
  })

  const mutation = useMutation({
    mutationFn: supportService.send,
    onSuccess: () => {
      toast.success("Support request sent successfully")
      form.reset({
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        description: "",
      })
    },
    onError: () => {
      toast.error("Failed to send support request")
    },
  })

  const onSubmit = (values: SupportFormValues) => {
    mutation.mutate(values)
  }

  return (
    <section className="w-full min-h-screen p-10">
      {/* ----------------------------- HEADER ----------------------------- */}
      <div className="mb-10!">
        <h1 className="text-5xl font-semibold text-white">
          Help & Support
        </h1>
        <p className="text-white/60 mt-2!">
          Need help? Describe your issue and our team will get back to you.
        </p>
      </div>

      {/* ------------------------------ CARD ------------------------------ */}
      <div
        className="
          relative max-w-3xl
          rounded-[8px]
          border border-white/10
          bg-gradient-to-br from-zinc-900 to-zinc-950
          p-8
        "
      >
        {/* ---------------------------- LOADER ---------------------------- */}
        {mutation.isPending && (
          <div className="
            absolute inset-0 z-10
            bg-black/40 backdrop-blur-[2px]
            rounded-[8px]
            flex items-center justify-center
          ">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-sm font-medium">
                Sending your request…
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------ FORM ----------------------------- */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6!"
        >
          {/* EMAIL */}
          <div>
            <label className="text-sm text-white/70 mb-1! block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-4 text-white/40" />
              <input
                {...form.register("email")}
                disabled={!!user?.email}
                className="
                  w-full h-11 pl-10 pr-3
                  rounded-[8px]
                  bg-black/40
                  border border-white/10
                  text-white
                  placeholder:text-white/40
                  disabled:opacity-60
                "
                placeholder="your@email.com"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-white/70 mb-1! block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 size-4 text-white/40" />
              <input
                {...form.register("phoneNumber")}
                className="
                  w-full h-11 pl-10 pr-3
                  rounded-[8px]
                  bg-black/40
                  border border-white/10
                  text-white
                  placeholder:text-white/40
                "
                placeholder="Enter phone number"
              />
            </div>
            {form.formState.errors.phoneNumber && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-white/70 mb-1! block">
              Describe your issue
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 size-4 text-white/40" />
              <textarea
                {...form.register("description")}
                rows={5}
                className="
                  w-full pl-10 pr-3 py-2
                  rounded-[8px]
                  bg-black/40
                  border border-white/10
                  text-white
                  placeholder:text-white/40
                  resize-none
                "
                placeholder="Explain your issue in detail..."
              />
            </div>
            {form.formState.errors.description && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="
                btn-primary
                min-w-[200px]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <span className="flex items-center justify-center gap-2">
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Support Request"
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
