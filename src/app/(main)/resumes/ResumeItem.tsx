"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { formatDate } from "date-fns";

import { MoreVertical, Printer, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toResumeFormValuesMapper } from "@/lib/utils";

import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteResume } from "@/app/(main)/resumes/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResumeServerData } from "@/lib/types";
import { useReactToPrint } from "react-to-print";

interface ResumeItemProps {
  resume: ResumeServerData;
}

function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const wasUpdated = resume.updatedAt !== resume.createdAt;

  const printFunction = useReactToPrint({
    contentRef,
    documentTitle: resume.title || Date.now().toString(),
  });

  return (
    <div className="group hover:border-border bg-secondary relative rounded-lg border border-transparent p-3 transition-colors">
      <div className="space-y-5">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-muted-foreground text-xs">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            contentRef={contentRef}
            resume={toResumeFormValuesMapper(resume)}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenuActions resumeId={resume.id} onPrintClick={printFunction} />
    </div>
  );
}

export default ResumeItem;

interface MoreMenuActionsProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenuActions({ resumeId, onPrintClick }: MoreMenuActionsProps) {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0.5 right-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowConfirmationDialog(true)}
          >
            <Trash2 className="size-4 text-red-500" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" /> Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      />
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog(props: DeleteConfirmationDialogProps) {
  const { resumeId, open, onOpenChange } = props;
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
      } catch (e) {
        console.error("Error in delete resume:  ", e);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete resume?</DialogTitle>
          <DialogDescription>
            This will permanently delete the resume. This action cannot be
            undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
          <Button onClick={() => onOpenChange(false)} variant="secondary">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
