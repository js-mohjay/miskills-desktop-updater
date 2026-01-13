"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { adminCareerSupportService } from "@/services/admin.career-support";

export default function UpdateStatusDialog({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(item.status);
  const [stage, setStage] = useState(item.currentStage || "");

  const qc = useQueryClient();

  const submit = async () => {
    await adminCareerSupportService.updateStatus(item._id, {
      interviewStatus: status,
      currentStage: stage,
    });

    qc.invalidateQueries({ queryKey: ["admin-career-support"] });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-violet-400 hover:underline"
      >
        Update
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-[8px]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <input
              className="w-full p-2 rounded-[8px] bg-black/40 border border-white/10"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Interview Status"
            />

            <input
              className="w-full p-2 rounded-[8px] bg-black/40 border border-white/10"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              placeholder="Current Stage"
            />

            <button onClick={submit} className="btn-primary w-full">
              <span>Save</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
