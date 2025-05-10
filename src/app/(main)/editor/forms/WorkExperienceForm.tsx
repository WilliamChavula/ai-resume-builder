import { useEffect } from "react";

import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { GripHorizontal } from "lucide-react";

import { debounce } from "@/lib/debounce";
import { TResumeFormProps } from "@/lib/types";
import { TWorkExperienceForm, workExperienceSchema } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const WorkExperienceForm = ({ resume, setResumeData }: TResumeFormProps) => {
  const form = useForm<TWorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: resume.workExperience || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  useEffect(() => {
    const validateForm = debounce<TWorkExperienceForm>(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setResumeData({ ...resume, ...values });
    }, 300);

    const { unsubscribe } = form.watch((values) => {
      validateForm({
        workExperience:
          values.workExperience?.filter((exp) => exp !== undefined) || [],
      });
    });

    return () => {
      unsubscribe();
      validateForm.cancel(); // Cancel pending debounced calls
    };
  }, [form, resume, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-muted-foreground text-sm">
          Add all your relevant work experience.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field, i) => (
            <WorkExperienceItem
              key={field.id}
              index={i}
              form={form}
              remove={remove}
            />
          ))}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              Add Work Experience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;

type WorkExperienceItemProps = {
  form: UseFormReturn<TWorkExperienceForm>;
  index: number;
  remove: (index: number) => void;
};

const WorkExperienceItem = ({
  form,
  index,
  remove,
}: WorkExperienceItemProps) => {
  return (
    <div className="bg-background space-y-3 rounded-md border p-3">
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Work experience {index + 1}</span>
        <GripHorizontal className="text-muted-foreground size-5 cursor-grab" />
      </div>
      <FormField
        name={`workExperience.${index}.position`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name={`workExperience.${index}.company`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          name={`workExperience.${index}.startDate`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={`workExperience.${index}.endDate`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value?.slice(0, 10)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        Leave <strong>end date</strong> empty if you currently work here.
      </FormDescription>
      <FormField
        name={`workExperience.${index}.description`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button variant="destructive" onClick={() => remove(index)} type="button">
        Remove
      </Button>
    </div>
  );
};
