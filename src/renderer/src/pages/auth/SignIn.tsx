"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import logo from "../assets/logo.png"
import logoWhite from "../../assets/logo-white.png"
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion"
import { authApi } from "@/services/auth.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/store/auth/useAuthStore";
import { LoaderIcon } from "lucide-react";

const formSchema = z.object({
  identifier: z.string().min(2, "Email or mobile number is required"),
  otp: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const SignIn = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canEditIdentifier, setCanEditIdentifier] = useState(true);

  let navigate = useNavigate()

  const dynamicSchema = isOtpSent
    ? formSchema.extend({
      otp: z.string().length(6, "OTP must be 6 digits"),
    })
    : formSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    // trigger
  } = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      identifier: "",
      otp: "",        // <-- REQUIRED
    },
    mode: "onSubmit",          // <— prevents instant errors
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (identifier: string) => authApi.sendOtp(identifier),

    onError: (error, _variables, _context) => {
      const err = error as AxiosError<any>;

      toast.error(
        err.response?.data?.message ?? "Failed to send OTP"
      );
    },

    onSuccess: () => {
      setIsOtpSent(true);
      setCanEditIdentifier(false);
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { identifier: string; otp: string }) =>
      authApi.verifyOtp(payload.identifier, payload.otp),

    onSuccess: (res) => {
      const d = res.data.data;

      useAuth.getState().login(
        d.user,
        d.accessToken,
        d.refreshToken
      );
      toast.success("Login Successful!");
      // wait 1 tick for Zustand update + router refresh
      requestAnimationFrame(() => {
        if (d?.user?.studentId && d.user.studentId.length > 0) {
          if (d.user.role === "admin") navigate("/admin");
          else if (d.user.role === "student") navigate("/student");
          else if (d.user.role === "training") navigate("/training");
          else navigate("/", { replace: true })
        } else {
          navigate("/onboard", { replace: true });
        }
      });
    },

    onError: (error, _vars, _ctx) => {
      const err = error as AxiosError<any>;

      toast.error(
        err.response?.data?.message ??
        "Could not verify OTP at the moment. Try again."
      );
    }
  });


  const handleSendOtp = (data: FormData) => {
    sendOtpMutation.mutate(data.identifier);
  };


  const handleVerifyOtp = (data: FormData) => {
    verifyOtpMutation.mutate(
      { identifier: data.identifier, otp: data.otp! }
    );
  };



  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        className="w-full h-full p-24 max-w-xl flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit(isOtpSent ? handleVerifyOtp : handleSendOtp)}
      >
        <motion.div
          className="w-full flex justify-center items-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logoWhite} alt="" height={160} width={160} />
        </motion.div>

        <motion.h1
          className="text-center text-5xl font-semibold! mb-6!"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome Back.
        </motion.h1>

        {/* Identifier Field */}
        <motion.div
          className="w-full max-w-sm flex flex-col gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label htmlFor="identifier" className="font-[500]! mb-2">
            Enter Mobile Number or E-Mail:
          </label>
          <input
            {...register("identifier")}
            type="text"
            id="identifier"
            disabled={!canEditIdentifier}   // <-- IMPORTANT
            className={`
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded block w-full px-3 py-2.5 shadow-xs
              placeholder:text-slate-300
              ${!canEditIdentifier ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder="+91 9999999999/example@xyz.com"
            required
          />

          {errors.identifier && (
            <p className="text-sm text-red-500">{errors.identifier.message}</p>
          )}
        </motion.div>

        {isOtpSent && !canEditIdentifier && (
          <button
            type="button"
            onClick={() => {
              setCanEditIdentifier(true);
              setIsOtpSent(false);
              setValue("otp", "");   // reset otp
            }}
            className="cursor-pointer text-sm text-violet-400 hover:underline mt-1 self-start"
          >
            Change email / mobile
          </button>
        )}


        {/* OTP FIELD – Shown only after sending OTP */}
        {isOtpSent && (
          <motion.div
            className="w-full max-w-sm flex flex-col gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="otp" className="font-[500]!">Enter OTP:</label>

            {/* <input
              {...register("otp", {
                required: "OTP is required",
                minLength: {
                  value: 4,
                  message: "OTP must be at least 4 digits",
                },
              })}
              id="otp"
              type="text"
              className="mt-1 p-2 rounded bg-white text-black"
            /> */}

            <InputOTP
              className="text-[var(--ev-c-white)]"
              maxLength={6}
              value={watch("otp") ?? ""}
              onChange={(value) => setValue("otp", value, { shouldValidate: true })}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={1} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={4} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={5} className="bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-[1.05rem]!" />
              </InputOTPGroup>
            </InputOTP>


            {errors.otp && (
              <p className="text-sm text-yellow-300">{errors.otp.message}</p>
            )}
          </motion.div>
        )}

        {/* BUTTON */}
        <motion.button
          type="submit"
          className="btn-primary w-full!"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>
            {(sendOtpMutation.isPending || verifyOtpMutation.isPending) ? (
              <LoaderIcon size={30} className="animate-spin" />
            ) : (
              isOtpSent ? "Verify & Login" : "Send OTP"
            )}
          </span>

        </motion.button>

        <motion.p
          className="text-sm mt-4!"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Don't have an account? <Link to="/signup" className="text-violet-400 hover:text-violet-500 hover:underline transition duration-300 cursor-pointer">Sign-Up</Link>
        </motion.p>

        <motion.p
          className="absolute left-6 bottom-4 text-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => {
              localStorage.removeItem("hasSeenSplash")
              window.api.quitApp()
            }}
            className="px-4 py-2 text-lg! bg-red-600 hover:bg-red-700 rounded-[8px] text-white cursor-pointer"
          >
            Exit App
          </button>

        </motion.p>

        <motion.p
          className="absolute right-4 bottom-4 text-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/employee-signin" className="text-violet-400 hover:text-violet-500 hover:underline transition duration-300 cursor-pointer">Employee Portal</Link>
        </motion.p>

      </form>
    </div>

  );
};

export default SignIn;
