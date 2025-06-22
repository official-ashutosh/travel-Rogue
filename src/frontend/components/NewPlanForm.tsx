"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDbAuth from "@/frontend/hooks/useDbAuth";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/frontend/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/frontend/components/ui/form";
import { Loader2, MessageSquarePlus, Wand2 } from "lucide-react";
import { generatePlanAction } from "@/shared/lib/actions/generateplanAction";
import PlacesAutoComplete from "@/frontend/components/PlacesAutoComplete";

import { generateEmptyPlanAction } from "@/shared/lib/actions/generateEmptyPlanAction";
import { useToast } from "@/frontend/components/ui/use-toast";
import CompanionControl from "@/frontend/components/plan/CompanionControl";
import ActivityPreferences from "@/frontend/components/plan/ActivityPreferences";
import DateRangeSelector from "@/frontend/components/common/DateRangeSelector";

const formSchema = z.object({
  placeName: z
    .string({ required_error: "Please select a place" })
    .min(3, "Place name should be at least 3 character long"),
  datesOfTravel: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine((data) => data.to >= data.from, {
      message: "End date cannot be before start date",
      path: ["to"], // Associates the error with the 'to' field
    }),
  activityPreferences: z.array(z.string()),
  companion: z.optional(z.string()),
  userId: z.optional(z.string()),
});

export type formSchemaType = z.infer<typeof formSchema>;

const NewPlanForm = ({
  closeModal,
}: {
  closeModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, isAuthenticated } = useDbAuth();
  const [pendingEmptyPlan, startTransactionEmptyPlan] = useTransition();
  const [pendingAIPlan, startTransactionAiPlan] = useTransition();
  const [selectedFromList, setSelectedFromList] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<formSchemaType, any, any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityPreferences: [],
      companion: undefined,
      placeName: "",
      datesOfTravel: {
        from: undefined,
        to: undefined,
      },
      userId: user?.id, // Set the default value of userId from the authenticated user
    },
  });

  if (!isAuthenticated) return null;

  async function onSubmitEmptyPlan(values: z.infer<typeof formSchema>) {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return;
    }

    startTransactionEmptyPlan(async () => {
      try {
        const planId = await generateEmptyPlanAction(values);
        console.log("[EmptyPlan] Created planId:", planId);
        if (!planId) {
          toast({
            title: "Error",
            description: "Could not create plan. Please try again. (Check backend/API logs for details)",
            variant: "destructive",
          });
          return;
        }
        if (typeof planId !== "string" || !planId.trim()) {
          toast({
            title: "Error",
            description: "Invalid plan ID returned. Please try again.",
            variant: "destructive",
          });
          return;
        }
        closeModal(false);
        router.push(`/plans/${planId}/plan?isNewPlan=true`);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Could not create plan. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  async function onSubmitAIPlan(values: z.infer<typeof formSchema>) {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return;
    }

    startTransactionAiPlan(async () => {
      try {
        const planId = await generatePlanAction(values);
        console.log("[AIPlan] Created planId:", planId);
        if (!planId) {
          toast({
            title: "Error",
            description: "Could not create AI plan. Please try again. (Check backend/API logs for details)",
            variant: "destructive",
          });
          return;
        }
        if (typeof planId !== "string" || !planId.trim()) {
          toast({
            title: "Error",
            description: "Invalid plan ID returned. Please try again.",
            variant: "destructive",
          });
          return;
        }
        closeModal(false);
        router.push(`/plans/${planId}/plan?isNewPlan=true`);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Could not create AI plan. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="placeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for your destination city</FormLabel>
              <FormControl>
                <PlacesAutoComplete
                  field={field}
                  form={form}
                  selectedFromList={selectedFromList}
                  setSelectedFromList={setSelectedFromList}
                  userId={user?.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="datesOfTravel"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Dates</FormLabel>
              <DateRangeSelector
                value={field.value}
                onChange={field.onChange}
                forGeneratePlan={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activityPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select the kind of activities you want to do
                <span className="font-medium ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <ActivityPreferences
                  values={field.value}
                  onChange={(e) => field.onChange(e)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who are you travelling with
                <span className="font-medium ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <CompanionControl
                  value={field.value}
                  onChange={(id: string) => field.onChange(id)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between gap-1">
          <Button
            onClick={() => form.handleSubmit(onSubmitEmptyPlan)()}
            aria-label="generate plan"
            type="submit"
            disabled={pendingEmptyPlan || pendingAIPlan || !form.formState.isValid}
            className="bg-blue-500 text-white hover:bg-blue-600 w-full"
          >
            {pendingEmptyPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating Travel Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center">
                <MessageSquarePlus className="h-4 w-4" />
                <span>Create Your Plan</span>
              </div>
            )}
          </Button>

          <Button
            onClick={() => form.handleSubmit(onSubmitAIPlan)()}
            aria-label="generate AI plan"
            type="submit"
            disabled={pendingAIPlan || pendingEmptyPlan || !form.formState.isValid}
            className="bg-indigo-500 text-white hover:bg-indigo-600 w-full group"
          >
            {pendingAIPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating AI Travel Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center ">
                <Wand2 className="h-4 w-4 group-hover:animate-pulse" />
                <span>Generate AI Plan</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPlanForm;
