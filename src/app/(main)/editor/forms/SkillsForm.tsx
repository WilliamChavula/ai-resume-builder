import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { debounce } from "@/lib/debounce";
import { TResumeFormProps } from "@/lib/types";
import { skillsSchema, TSkills } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const SkillsForm = ({ resume, setResumeData }: TResumeFormProps) => {
  const form = useForm<TSkills>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resume.skills || [],
    },
  });

  useEffect(() => {
    const validateForm = debounce<TSkills>(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setResumeData({ ...resume, ...values });
    }, 300);

    const { unsubscribe } = form.watch((values) => {
      validateForm({
        skills:
          values.skills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") || [],
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
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-muted-foreground text-sm">
          Add your professional skills here.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            name="skills"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Your Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. project management, typing, communication, ..."
                    onChange={(evt) => {
                      const skills = evt.target.value.split(",");
                      field.onChange(skills);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Add your skills separated by comma (,)
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
