"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { LoaderIcon } from "lucide-react";
import { onboardPayload, userService } from "@/services/user.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { mailService } from "@/services/mail.service";
import { useAuth } from "@/store/auth/useAuthStore";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

import states from "../../assets/state.json";
import cities from "../../assets/statesCity.json";

import { format, isBefore, parseISO } from "date-fns";
import { universityService } from "@/services/university.service";

// state.json
type StateItem = {
  id: number;
  name: string;
};


const formSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1),
  email: z.string(),
  phoneNumber: z.string(),
  otp: z.string().optional(),
  dob: z.string().refine((value) => {
    const date = parseISO(value);
    const minDate = subYears(new Date(), 18);
    return isBefore(date, minDate) || date.getTime() === minDate.getTime();
  }, {
    message: "You must be at least 18 years old",
  }),
  state: z.string().min(1),
  city: z.string().min(1),
  college: z.string().min(1),
});


type FormData = z.infer<typeof formSchema>;

import { subYears } from "date-fns";

const MIN_AGE_DATE = subYears(new Date(), 18);


const OnboardStudent = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canEditIdentifier, setCanEditIdentifier] = useState(true);

  let navigate = useNavigate()

  const { studentId, setStudentId, logout } = useAuth()
  const user = useAuth(s => s.user)

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
      avatar: "",
      name: "",
      email: "",
      phoneNumber: "",
      dob: "",
      city: "",
      state: "",
      college: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (user) {
      setValue("avatar", user.avatar)
      setValue("name", user.name)
      setValue("email", user.email)
    }
  }, [user])


  // city - state - college
  const getUniversitiesMutation = useMutation<
    { _id: string; name: string }[],
    AxiosError,
    string
  >({
    mutationFn: async (state: string) => {
      const res = await universityService.getUniversities(state);
      return res.data.data;
    },
  });


  const selectedState = watch("state");
  const selectedCollege = watch("college");
  const selectedDOB = watch("dob")

  const selectedStateCities =
    cities.find((s) => s.name === selectedState)?.cities ?? [];


  useEffect(() => {
    if (selectedState) {
      setValue("city", "");
      setValue("college", "");
      getUniversitiesMutation.mutate(selectedState);
    }
  }, [selectedState]);


  const sendMailOTPMutation = useMutation({
    mutationFn: async (email: string) => {
      await mailService.sendOTP(email)
    },

    onError: (error, _variables, _context) => {
      const err = error as AxiosError<any>;

      toast.error(
        err.response?.data?.message ?? "Failed to Send OTP to Mail"
      );
    },

    onSuccess: () => {
      setIsOtpSent(true);
      setCanEditIdentifier(false);
    }
  });

  type VerifyAndOnboardResult = {
    emailVerified: boolean;
    onboarded: boolean;
    studentId: string;
  };

  const verifyEmailAndOnboardMutation = useMutation<
    VerifyAndOnboardResult,
    AxiosError,
    onboardPayload
  >({
    mutationFn: async (payload: onboardPayload) => {
      // Step 1: verify email
      const emailRes = await mailService.verifyEmail(payload.email, payload.otp!);

      // Step 2: onboard user
      const res = await userService.setCollege(payload);

      // IMPORTANT: return a unified success object
      return {
        emailVerified: emailRes?.data?.success || false,
        onboarded: res.data.success,
        studentId: res.data.studentId
      };
    },

    onSuccess: (result) => {

      if (result.emailVerified) toast.success("OTP verified successfully.");
      if (result.onboarded) toast.success("Student ID generated successfully.");
      // Auth state first

      setStudentId(result.studentId);


      // Then navigate
      setTimeout(() => {
        navigate("/plans", { replace: true })
      }, 2000)
      // else if (result.onboarded.role === "student") navigate("/student", { replace: true });
    },

    onError: (error) => {
      const err = error as AxiosError<any>;
      toast.error(
        err.response?.data?.message ??
        "Could not verify OTP at the moment. Try again."
      );
    }
  });

  const onSubmit = (data: FormData) => {


    if (!isOtpSent) {
      console.log('sending otp')
      sendMailOTPMutation.mutate(data.email);
      return;
    }

    verifyEmailAndOnboardMutation.mutate({
      college: data.college,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar,
      name: data.name,
      email: data.email,
      dob: data.dob,
      city: data.city,
      state: data.state,
      otp: data.otp!, // safe: schema enforces it
    });
  };



  const handleLogout = async () => {
    const logoutRes = await logout()

    console.log("logout", logoutRes)
    // navigate("/signin", {replace: true})
  }


  return (
    <div className="h-screen flex flex-col justify-center items-center relative">
      <form
        className="w-full h-full p-24 max-w-2xl flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >


        <motion.h1
          className="text-center text-5xl font-semibold!"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Complete Profile
        </motion.h1>

        <motion.p className={"text-lg text-center mb-2"}>
          Fill in your details and verify to get your Student ID.
        </motion.p>


        <div className={"w-full grid grid-cols-2 gap-4"}>


          {/* full name */}
          <motion.div
            className="w-full max-w-sm flex flex-col gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="name" className="font-[500]!">
              Name:
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className={`
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded block w-full px-3 py-2.5 h-12 shadow-xs
              placeholder:text-slate-300
              ${!canEditIdentifier ? "opacity-50 cursor-not-allowed" : ""}
            `}
              placeholder="example_name"
              required
            />

            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </motion.div>

          {/* DOB */}
          <motion.div
            className="w-full flex flex-col gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="dob" className="font-[500]!">
              Date of Birth: <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              id="dob"
              value={watch("dob")}
              onChange={(e) =>
                setValue("dob", e.target.value, {
                  shouldValidate: true,
                })
              }
              min="1900-01-01"
              max={format(MIN_AGE_DATE, "yyyy-MM-dd")}
              className="
              bg-slate-700 border-2 border-violet-300
              text-[var(--ev-c-white-soft)]
              text-[1.05rem]
              rounded-[8px] block w-full px-3 py-2.5 h-12
              shadow-xs
              placeholder:text-slate-300
              [color-scheme:dark]
              [&::-webkit-calendar-picker-indicator]:invert
              [&::-webkit-calendar-picker-indicator]:opacity-70
            "
                    />

            {errors.dob && (
              <p className="text-sm text-red-500">
                {errors.dob.message}
              </p>
            )}
          </motion.div>



          <motion.div
            className={"w-full max-w-sm flex flex-col gap-2 "}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="state" className="font-[500]!">
              State/Union Territory:
            </label>
            <Select
              value={watch("state")}
              onValueChange={(value) => {
                setValue("state", value, { shouldValidate: true });
                // setValue("city", "");
                // setValue("college", "");
                // getUniversitiesMutation.mutate(value);
              }}
            >
              <SelectTrigger className="w-full justify-start text-left
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded px-3! h-12! shadow-xs
              placeholder:text-slate-300">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>

              <SelectContent>
                {states.map((state: StateItem, idx: any) => (
                  <SelectItem key={`${state.id}-${idx}`} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </motion.div>

          <motion.div
            className={"w-full max-w-sm flex flex-col gap-2 "}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="state" className="font-[500]!">
              City:
            </label>

            <Select
              value={watch("city")}
              onValueChange={(value) =>
                setValue("city", value, { shouldValidate: true })
              }
              disabled={!selectedState}
            >
              <SelectTrigger className="w-full justify-start text-left
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded px-3! h-12! shadow-xs
              placeholder:text-slate-300">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>

              <SelectContent>
                {selectedStateCities.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </motion.div>


          {/* college */}
          <motion.div
            className={"col-span-2 w-full flex flex-col gap-2"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="college" className="font-[500]!">
              College:
            </label>

            <Select
              value={watch("college")}
              onValueChange={(value) =>
                setValue("college", value, { shouldValidate: true })
              }
              disabled={!selectedState || getUniversitiesMutation.isPending}
            >
              <SelectTrigger className="w-full justify-start text-left
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded px-3! h-12! shadow-xs
              placeholder:text-slate-300">
                <SelectValue placeholder="Select College" />
              </SelectTrigger>

              <SelectContent>
                {getUniversitiesMutation.data?.map((college) => (
                  <SelectItem key={college._id} value={college.name}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </motion.div>

          <div className={"col-span-2"}>

            {/* E-Mail Field */}
            <motion.div
              className="w-full flex flex-col gap-2"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="email" className="font-[500]!">
                Enter E-Mail:
              </label>
              <input
                {...register("email")}
                type="text"
                id="email"
                disabled={!canEditIdentifier}   // <-- IMPORTANT
                className={`
              bg-slate-700 border-2 border-violet-300 text-[var(--ev-c-white-soft)]
              text-[1.05rem] rounded block w-full px-3 py-2.5 h-12 shadow-xs
              placeholder:text-slate-300
              ${!canEditIdentifier ? "opacity-50 cursor-not-allowed" : ""}
            `}
                placeholder="example@xyz.in"
                required
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
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
                Change email
              </button>
            )}


            {/* OTP FIELD – Shown only after sending OTP */}
            {isOtpSent && (
              <motion.div
                className="w-full flex flex-col gap-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <label htmlFor="otp" className="font-[500]!">Enter OTP:</label>
                <InputOTP
                  className="text-[var(--ev-c-white)]"
                  maxLength={6}
                  value={watch("otp") ?? ""}
                  onChange={(value) => setValue("otp", value, { shouldValidate: true })}
                >
                  <div className={"flex! justify-center! items-center! w-full! gap-4"}>

                    <InputOTPGroup>
                      <InputOTPSlot index={0}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={1}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={2}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={4}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={5}
                        className="h-13! w-14! bg-slate-700 rounded! border-2 border-violet-300 text-[var(--ev-c-white-soft)]! text-xl!" />
                    </InputOTPGroup>
                  </div>
                </InputOTP>


                {errors.otp && (
                  <p className="text-sm text-yellow-300">{errors.otp.message}</p>
                )}
              </motion.div>
            )}


          </div>

        </div>


        {studentId && (


          <motion.div
            className="w-full max-w-sm flex flex-col gap-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {studentId}
          </motion.div>

        )}
        {/* BUTTON */}
        <motion.button
          type="submit"
          className="btn-primary flex justify-center items-center
            disabled:opacity-50!
            disabled:cursor-not-allowed!
            disabled:pointer-events-none!
          "
          disabled={!isOtpSent && !selectedCollege && !selectedDOB}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>
            {(sendMailOTPMutation.isPending || verifyEmailAndOnboardMutation.isPending) ? (
              <LoaderIcon size={32} className="animate-spin" />
            ) : (
              isOtpSent ? "Verify & Onboard" : "Send OTP"
            )}
          </span>

        </motion.button>


      </form>

      <button
        onClick={handleLogout}
        className="z-[999] absolute bottom-4 left-4 px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition duration-300 cursor-pointer"
      >
        Logout
      </button>

    </div>

  );
};

export default OnboardStudent;
