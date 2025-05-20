"use client";

import Link from "next/link";
import { PlusSquare } from "lucide-react";

import usePremiumModal from "@/hooks/use-premium-modal";

import { Button } from "@/components/ui/button";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

const CreateResumeButton = ({ canCreate }: CreateResumeButtonProps) => {
  const { setOpen } = usePremiumModal();

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          New resume
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={() => setOpen(true)} className="mx-auto flex w-fit gap-2">
      <PlusSquare className="size-5" />
      New resume
    </Button>
  );
};

export default CreateResumeButton;
