import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { personalInfoFormSchema, TPersonalInfoForm } from "@/lib/validation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TResumeFormProps } from "@/lib/types";
import { useEffect } from "react";
import { debounce } from "@/lib/debounce";

const PersonalInfoForm = ({ resume, setResumeData }: TResumeFormProps) => {
  const form = useForm<TPersonalInfoForm>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      firstName: resume.firstName || "",
      lastName: resume.lastName || "",
      email: resume.email || "",
      city: resume.city || "",
      country: resume.country || "",
      jobTitle: resume.jobTitle || "",
      phone: resume.phone || "",
    },
  });

  useEffect(() => {
    const validateForm = debounce<TPersonalInfoForm>(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setResumeData({ ...resume, ...values });
    }, 300);

    const { unsubscribe } = form.watch((values) => {
      validateForm(values);
    });

    return () => {
      unsubscribe();
      validateForm.cancel(); // Cancel pending debounced calls
    };
  }, [form, resume, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Personal info</h2>
        <p className="text-muted-foreground text-sm">Tell us about yourself.</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            render={({ field: { value, ...attrs } }) => (
              <FormItem>
                <FormLabel htmlFor="id-photo">Your photo</FormLabel>
                <FormControl>
                  <Input
                    {...attrs}
                    type="file"
                    accept="image/*"
                    onChange={(evt) => {
                      const file = evt.target.files?.[0];
                      attrs.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            name="photo"
            control={form.control}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="id-firstName">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} id="id-firstName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="id-lastName">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} id="id-lastName" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="jobTitle"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id-jobTitle">Job Title</FormLabel>
                <FormControl>
                  <Input {...field} id="id-jobTitle" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="id-city">City</FormLabel>
                  <FormControl>
                    <Input {...field} id="id-city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="country"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="id-country">Country</FormLabel>
                  <FormControl>
                    <Input {...field} id="id-country" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id-phone">Phone</FormLabel>
                <FormControl>
                  <Input {...field} id="id-phone" type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="id-email">Email</FormLabel>
                <FormControl>
                  <Input {...field} id="id-email" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;
