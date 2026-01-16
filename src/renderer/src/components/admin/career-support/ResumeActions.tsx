import PdfViewerDialog from "@/components/common/PdfViewerDialog";
import { useState } from "react";

export default function ResumeActions({ url }: { url: string }) {
  const fullUrl = import.meta.env.VITE_BACKEND_BASE_URL + url;

  const [open, setOpen] = useState(false)


  return (
    <div className="flex gap-3">
      {/* <a
        href={fullUrl}
        target="_blank"
        className="flex items-center gap-1 text-violet-400 hover:underline"
      >
        <FileText size={16} />
        View
      </a> */}


      <PdfViewerDialog
        open={open}
        onClose={() => setOpen(false)}
        pdfUrl={fullUrl}
      />


      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-green-400 hover:underline"
      >
        View Resume
      </button>
    </div>
  );
}
