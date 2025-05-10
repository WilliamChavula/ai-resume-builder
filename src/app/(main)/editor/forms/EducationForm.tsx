import { useEffect } from "react";

import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";

import { debounce } from "@/lib/debounce";
import { TResumeFormProps } from "@/lib/types";
import { educationSchema, TEducationForm } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EducationForm = ({ resume, setResumeData }: TResumeFormProps) => {
  const form = useForm<TEducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: resume.education || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  useEffect(() => {
    const validateForm = debounce<TEducationForm>(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setResumeData({ ...resume, ...values });
    }, 300);

    const { unsubscribe } = form.watch((values) => {
      validateForm({
        education: values.education?.filter((edu) => edu !== undefined) || [],
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
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-muted-foreground text-sm">
          Add your academic achievements here.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field, i) => (
            <EducationItem
              key={field.id}
              form={form}
              remove={remove}
              index={i}
            />
          ))}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  degree: "",
                  school: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              Add Education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EducationForm;

type EducationItemProps = {
  form: UseFormReturn<TEducationForm>;
  remove: (index: number) => void;
  index: number;
};

const EducationItem = ({ form, remove, index }: EducationItemProps) => (
  <div className="bg-background space-y-3 rounded-md border p-3">
    <div className="flex justify-between gap-2">
      <span className="font-semibold">Education {index + 1}</span>
      <GripHorizontal className="text-muted-foreground size-5 cursor-grab" />
    </div>
    <FormField
      name={`education.${index}.degree`}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Degree</FormLabel>
          <FormControl>
            <Input {...field} autoFocus />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      name={`education.${index}.school`}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>School</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <div className="grid grid-cols-2 gap-3">
      <FormField
        name={`education.${index}.startDate`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        name={`education.${index}.endDate`}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
    <Button variant="destructive" onClick={() => remove(index)} type="button">
      Remove
    </Button>
  </div>
);
