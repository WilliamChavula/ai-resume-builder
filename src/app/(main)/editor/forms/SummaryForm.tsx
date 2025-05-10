import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { debounce } from "@/lib/debounce";
import { TResumeFormProps } from "@/lib/types";
import { summarySchema, TSummary } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const SummaryForm = ({ resume, setResumeData }: TResumeFormProps) => {
  const form = useForm<TSummary>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resume.summary || "",
    },
  });

  useEffect(() => {
    const validateForm = debounce<TSummary>(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setResumeData({ ...resume, ...values });
    }, 300);

    const { unsubscribe } = form.watch((values) => {
      validateForm({ ...resume, ...values });
    });

    return () => {
      unsubscribe();
      validateForm.cancel(); // Cancel pending debounced calls
    };
  }, [form, resume, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-muted-foreground text-sm">
          Add your professional summary here or use generative AI.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            name="summary"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Professional Summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="I am a professional with 4 years experience..."
                  />
                </FormControl>
                <FormDescription>
                  A brief engaging professional bio.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SummaryForm;
