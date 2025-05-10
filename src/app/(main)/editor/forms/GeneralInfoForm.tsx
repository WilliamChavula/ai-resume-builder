import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { generalInfoFormSchema, TGeneralInfoForm } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const GeneralInfoForm = () => {
  const form = useForm<TGeneralInfoForm>({
    resolver: zodResolver(generalInfoFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General info</h2>
        <p className="text-muted-foreground text-sm">
          This will not appear on your resume
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id-title">Project Name</FormLabel>
                <FormControl>
                  <Input
                    id="id-title"
                    {...field}
                    autoFocus
                    placeholder="My creative resume"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="title"
          />
          <FormField
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id-description">
                  Project description
                </FormLabel>
                <FormControl>
                  <Input
                    id="id-description"
                    {...field}
                    placeholder="Short description of your resume project"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="description"
          />
        </form>
      </Form>
    </div>
  );
};

export default GeneralInfoForm;
