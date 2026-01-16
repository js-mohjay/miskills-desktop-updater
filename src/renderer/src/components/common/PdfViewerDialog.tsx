"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  pdfUrl: string
}

export default function PdfViewerDialog({
  open,
  onClose,
  title = "Document Preview",
  pdfUrl,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl! h-[85vh] p-0 rounded-[8px] overflow-hidden">

        {/* Accessibility-only title (required by Dialog) */}
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Custom Close Button */}
        {/* <button
          onClick={onClose}
          className="
            absolute top-0 right-0 z-50
            rounded-full p-2
            bg-black/60 hover:bg-black/80
            text-white transition
          "
        >
          <X className="size-5" />
        </button> */}

        {/* PDF Viewer */}
        <iframe
          src={`${pdfUrl}#navpanes=0`}
          className="w-full! h-full!  text-white!"
        />
      </DialogContent>
    </Dialog>
  )
}
