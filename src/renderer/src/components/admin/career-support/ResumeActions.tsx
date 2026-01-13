import { FileText, Download } from "lucide-react";

export default function ResumeActions({ url }: { url: string }) {
  const fullUrl = import.meta.env.VITE_BACKEND_BASE_URL + url;

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

      <a
        href={fullUrl}
        download
        className="flex items-center gap-1 text-green-400 hover:underline"
      >
        <Download size={16} />
        Download
      </a>
    </div>
  );
}
