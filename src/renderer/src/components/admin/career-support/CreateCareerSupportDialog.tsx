"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminCareerSupportService } from "@/services/admin.career-support";

export default function CreateCareerSupportDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    careerProfileId: "",
    interviewDate: "",
    interviewTime: "",
    company: "",
    stages: "",
  });

  const qc = useQueryClient();

  const submit = async () => {
    await adminCareerSupportService.createApplication({
      ...form,
      stages: form.stages.split(",").map((s: string) => s.trim()),
    });

    qc.invalidateQueries({ queryKey: ["admin-career-support"] });
    setOpen(false);
  };

  return (
    <>
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <span>+ Add Career Support</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[8px]">
          <DialogHeader>
            <DialogTitle>Create Career Support</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {["careerProfileId", "interviewDate", "interviewTime", "company", "stages"].map(
              (key) => (
                <input
                  key={key}
                  placeholder={key}
                  className="p-2 rounded-[8px] bg-black/40 border border-white/10 col-span-2"
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              )
            )}

            <button
              onClick={submit}
              className="btn-primary col-span-2"
            >
              <span>Create</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
