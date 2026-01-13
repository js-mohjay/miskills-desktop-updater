"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderIcon, CalendarIcon } from "lucide-react";
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
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import states from "../../assets/state.json";
import cities from "../../assets/statesCity.json";

import { format, isBefore, parseISO, subYears } from "date-fns";
import { universityService } from "@/services/university.service";

type StateItem = {
  id: number;
  name: string;
};

const MIN_AGE_DATE = subYears(new Date(), 18);

const formSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string(),
  otp: z.string().optional(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => {
      const date = parseISO(value);
      return isBefore(date, MIN_AGE_DATE) || date.getTime() === MIN_AGE_DATE.getTime();
    }, { message: "You must be at least 18 years old" }),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  college: z.string().min(1, "College is required"),
});

type FormData = z.infer<typeof formSchema>;

const OnboardStudent = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [canEditIdentifier, setCanEditIdentifier] = useState(true);

  const navigate = useNavigate();
  const { studentId, setStudentId } = useAuth();
  const user = useAuth((s) => s.user);

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
  });

  useEffect(() => {
    if (user) {
      setValue("avatar", user.avatar);
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user]);

  const getUniversitiesMutation = useMutation({
    mutationFn: async (state: string) => {
      const res = await universityService.getUniversities(state);
      return res.data.data;
    },
  });

  const selectedState = watch("state");
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
    mutationFn: async (email: string) => mailService.sendOTP(email),
    onSuccess: () => {
      setIsOtpSent(true);
      setCanEditIdentifier(false);
    },
    onError: (error) => {
      const err = error as AxiosError<any>;
      toast.error(err.response?.data?.message ?? "Failed to send OTP");
    },
  });

  const verifyEmailAndOnboardMutation = useMutation({
    mutationFn: async (payload: onboardPayload) => {
      await mailService.verifyEmail(payload.email, payload.otp!);
      const res = await userService.setCollege(payload);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success("OTP verified & student onboarded");
      setStudentId(res.studentId);
      setTimeout(() => navigate("/plans", { replace: true }), 1500);
    },
    onError: (error) => {
      const err = error as AxiosError<any>;
      toast.error(err.response?.data?.message ?? "Verification failed");
    },
  });

  const onSubmit = (data: FormData) => {
    if (!isOtpSent) {
      sendMailOTPMutation.mutate(data.email);
      return;
    }

    verifyEmailAndOnboardMutation.mutate({
      ...data,
      otp: data.otp!,
    });
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <form
        className="w-full h-full p-24 max-w-2xl flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit(onSubmit, (formErrors) => {
          const firstError = Object.values(formErrors)[0];
          toast.error(
            (firstError?.message as string) ??
            "Please fill all required fields"
          );
        })}
      >
        <motion.h1 className="text-center text-5xl font-semibold">
          Complete Profile
        </motion.h1>

        {/* DOB FIELD */}
        <div className="w-full flex flex-col gap-2">
          <label>Date of Birth:</label>

          {/* 🔥 CRITICAL: register DOB */}
          <input type="hidden" {...register("dob")} />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch("dob") || "Select Date of Birth"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">

              <Calendar
                mode="single"
                captionLayout="dropdown-years"   // ✅ valid
                startMonth={new Date(1900, 0)}   // ✅ replaces fromMonth/fromYear
                endMonth={MIN_AGE_DATE}          // ✅ replaces toMonth/toYear
                defaultMonth={MIN_AGE_DATE}
                selected={
                  watch("dob")
                    ? new Date(watch("dob"))
                    : undefined
                }

                onSelect={(date) => {
                  if (!date) return;

                  setValue(
                    "dob",
                    format(date, "yyyy-MM-dd"),
                    { shouldValidate: true }
                  );

                }}
                disabled={(date) =>
                  date > MIN_AGE_DATE || date < new Date("1900-01-01")
                }
              />

            </PopoverContent>
          </Popover>

          {errors.dob && (
            <p className="text-sm text-red-500">{errors.dob.message}</p>
          )}
        </div>

        {/* SUBMIT */}
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={sendMailOTPMutation.isPending || verifyEmailAndOnboardMutation.isPending}
        >
          {(sendMailOTPMutation.isPending ||
            verifyEmailAndOnboardMutation.isPending) && (
              <LoaderIcon className="animate-spin" />
            )}
          {isOtpSent ? "Verify & Onboard" : "Send OTP"}
        </motion.button>
      </form>
    </div>
  );
};

export default OnboardStudent;
