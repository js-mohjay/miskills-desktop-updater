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
  name: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(2, "Mobile number is required"),
  role: z.string().optional(),
  deviceToken: z.string().optional(),
  otp: z.string().optional(), // OTP validates only after sending
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
      name: "",
      phoneNumber: "",
      role: "student",
      deviceToken: ""
    },
    mode: "onSubmit",          // <— prevents instant errors
  });


type signupPayload = {
  name: string,
  phoneNumber: string,
  role: "student",
  deviceToken: string,
}


  const signupMutation = useMutation({
    mutationFn: async (payload: signupPayload) => {
      await authApi.signup(payload)
      // await authApi.sendOtp(payload.phoneNumber)
    },

    onError: (error, _variables, _context) => {
      const err = error as AxiosError<any>;

      toast.error(
        err.response?.data?.message ?? "Failed to Sign-Up"
      );
    },

    onSuccess: () => {
      setIsOtpSent(true);
      setCanEditIdentifier(false);
    }
  });

  const verifySignupOtpMutation = useMutation({
    mutationFn: async (payload: { phoneNumber: string; otp: string }) =>
      authApi.verifySignupOtp(payload.phoneNumber, payload.otp),

    onSuccess: (res) => {
      const d = res.data.data;

      useAuth.getState().login(
        d.user,
        d.accessToken,
        d.refreshToken
      );
      toast.success("OTP verified Successful!");
      // wait 1 tick for Zustand update + router refresh

      requestAnimationFrame(() => {
        // navigate("/", { replace: true });
        navigate("/onboard", {replace: true})
        // if (d.user.role === "admin") navigate("/admin", {replace: true});
        // else if (d.user.role === "student") navigate("/student", {replace: true});
        // else if (d.user.role === "training") navigate("/training", {replace: true});

      });

      // setTimeout(() => {
      //   navigate('/')
      // }, 300)
    },

    onError: (error, _vars, _ctx) => {
      const err = error as AxiosError<any>;

      toast.error(
        err.response?.data?.message ??
        "Could not verify OTP at the moment. Try again."
      );
    }
  });

  const handleSignupAndSendOTP = (data: FormData) => {
    signupMutation.mutate({name: data.name, phoneNumber: data.phoneNumber, role: "student", deviceToken: ""});
  };


  const handleVerifyOtp = (data: FormData) => {
    verifySignupOtpMutation.mutate(
      { phoneNumber: data.phoneNumber, otp: data.otp! }
    );
  };


  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        className="w-full h-full p-24 max-w-xl flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit(isOtpSent ? handleVerifyOtp : handleSignupAndSendOTP)}
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
          Create your Account.
        </motion.h1>

        {/* name */}
        <motion.div
          className="w-full max-w-sm flex flex-col gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label htmlFor="name" className="font-[500]! mb-2">
            Name:
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            disabled={!canEditIdentifier}   // <-- IMPORTANT
            className={`
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded block w-full px-3 py-2.5 shadow-xs
              placeholder:text-slate-300
              ${!canEditIdentifier ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder="example_name"
            required
          />

          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </motion.div>


        {/* Phone number Field */}
        <motion.div
          className="w-full max-w-sm flex flex-col gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label htmlFor="phoneNumber" className="font-[500]! mb-2">
            Enter Mobile Number
          </label>
          <input
            {...register("phoneNumber")}
            type="text"
            id="phoneNumber"
            disabled={!canEditIdentifier}   // <-- IMPORTANT
            className={`
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded block w-full px-3 py-2.5 shadow-xs
              placeholder:text-slate-300
              ${!canEditIdentifier ? "opacity-50 cursor-not-allowed" : ""}
            `}
            placeholder="+91 9999999999"
            required
          />

          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
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
            {(signupMutation.isPending || verifySignupOtpMutation.isPending) ? (
              <LoaderIcon size={32} className="animate-spin" />
            ) : (
              isOtpSent ? "Verify & Signup" : "Send OTP"
            )}
          </span>

        </motion.button>

        <motion.p
          className="text-sm mt-4!"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Don't have an account? <Link to="/signin" className="text-violet-400 hover:text-violet-500 hover:underline transition duration-300 cursor-pointer">Sign-In</Link>
        </motion.p>

      </form>
    </div>

  );
};

export default SignIn;
