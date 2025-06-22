"use client";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";

import { Loading } from "@/frontend/components/shared/Loading";
import { Button } from "@/frontend/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/frontend/components/ui/form";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/frontend/components/ui/use-toast";
import currencies from "@/shared/lib/currencies.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  currency: z
    .string()
    .min(1, { message: "You will have to pick a preffered currency." }),
});

const CurrencySelector = ({ planId }: { planId: string }) => {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [preferredCurrency, setPreferredCurrency] = useState<string>("");

  // Fetch preferred currency from backend
  useEffect(() => {
    const fetchCurrency = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/plans/${planId}/currency`);
        if (res.ok) {
          const data = await res.json();
          setPreferredCurrency(data.currency || "");
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrency();
  }, [planId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: preferredCurrency || "",
    },
  });

  // Update form value when preferredCurrency changes
  useEffect(() => {
    if (preferredCurrency) {
      form.setValue("currency", preferredCurrency);
    }
  }, [preferredCurrency, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    try {
      const res = await fetch(`/api/plans/${planId}/currency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: values.currency }),
      });
      if (res.ok) {
        setPreferredCurrency(values.currency);
        toast({
          description: (
            <div className="font-sans flex justify-start items-center gap-1">
              Your preferences have been saved!
            </div>
          ),
        });
      } else {
        toast({
          description: "Failed to save currency.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        description: "An error occurred while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <article className="bg-background shadow-sm rounded-lg p-4 border-2 border-border">
      <h2 className="border-b-2 border-b-border pb-2 mb-2 font-bold font-md">
        Preffered Currency
      </h2>
      <h3 className="text-neutral-500 dark:text-neutral-400 mb-4 flex text-sm sm:text-base">
        Select your preffered currency for this plan which can be used in
        expenses section.
      </h3>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loading className="w-4 h-4" /> Loading currency...
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex gap-3 justify-start items-center"
          >
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      disabled={isSending}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={preferredCurrency || undefined}
                    >
                      <SelectTrigger className="max-w-md">
                        <SelectValue
                          placeholder={
                            preferredCurrency === undefined
                              ? "Loading preferred Currency"
                              : "Select a Currency"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Currency</SelectLabel>
                          {currencies.map((currency) => (
                            <SelectItem value={currency.cc} key={currency.cc}>
                              {currency.cc} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="ml-1" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSending}
              className={cn(
                "text-white hover:text-white bg-blue-500 hover:bg-blue-700"
              )}
            >
              {isSending ? (
                <div className="flex justify-center items-center gap-2">
                  <Loading className="w-4 h-4" /> Saving Preferences...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
      )}
      <p className="font-sans text-sm text-muted-foreground pt-3">
        Note: System defaults to INR if no currency is preffered.
      </p>
    </article>
  );
};

export default CurrencySelector;
