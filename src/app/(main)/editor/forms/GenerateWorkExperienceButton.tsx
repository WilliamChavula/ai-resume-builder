import { useState } from "react";
import {
  generateWorkExperienceSchema,
  TGenerateWorkExperience,
  TWorkExperience,
} from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { WandSparklesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateWorkExperience } from "@/app/(main)/editor/forms/actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
interface GenerateExperienceButtonProps {
  onWorkExperienceGenerated: (exp: TWorkExperience) => void;
}

const GenerateWorkExperienceButton = (props: GenerateExperienceButtonProps) => {
  const { onWorkExperienceGenerated } = props;
  const [showInputDialog, setShowInputDialog] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        type="button"
        // Todo: Block for non-premium users
        onClick={() => setShowInputDialog(true)}
      >
        <WandSparklesIcon className="size-4" /> Smart fill (AI)
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChanged={setShowInputDialog}
        onWorkExperienceGenerated={(exp) => {
          onWorkExperienceGenerated(exp);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

export default GenerateWorkExperienceButton;

interface InputDialogProps {
  open: boolean;
  onOpenChanged: (open: boolean) => void;
  onWorkExperienceGenerated: (exp: TWorkExperience) => void;
}
const InputDialog = (props: InputDialogProps) => {
  const { open, onOpenChanged, onWorkExperienceGenerated } = props;
  const { toast } = useToast();
  const form = useForm<TGenerateWorkExperience>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  const handleFormSubmit = async (input: TGenerateWorkExperience) => {
    try {
      const response = await generateWorkExperience(input);
      onWorkExperienceGenerated(response);
    } catch (e) {
      console.error("Error occurred in Generating Work Experience", e);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChanged}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Work Experience</DialogTitle>
          <DialogDescription>
            Describe this work experience and AI will generate an optimized
            entry for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="id-generate-experience">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="id-generate-experience"
                      placeholder="e.g. from 2 jan 96 to 13 december 2010 I worked at Pep as a sales..."
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="description"
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
