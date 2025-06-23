"use client";
import { Button } from "../ui/Button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.jsx";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form.jsx";
import { useState } from "react";
import { MessageCircleCode } from "lucide-react";
import { FEEDBACK_LABELS } from "../../lib/constants.js";
import { Textarea } from "../ui/textarea.jsx";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  message: z.string().min(2),
  label: z.union([
    z.literal("issue"),
    z.literal("idea"),
    z.literal("question"),
    z.literal("complaint"),
    z.literal("featurerequest"),
    z.literal("other"),
  ]),
});

const FeedbackSheet = () => {
  const [open, setOpen] = useState(false);
  const { planId } = useParams();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      label: ''
    }
  });
  const addFeedback = async (feedback) => {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(feedback),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  };const onSubmit = async (values) => {
    try {
      const { label, message } = values;
      
      await addFeedback({
        planId: planId ? String(planId) : undefined,
        label,
        message,
      });
        // Show success message
      alert('✅ Feedback submitted successfully! Thank you for your input.');
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('❌ Failed to submit feedback. Please try again.');
      // Don't reset form on actual error, let user try again
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" title="Give Feedback">
          <MessageCircleCode className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>We Value Your Feedback!</SheetTitle>
          <SheetDescription>
            Please take a moment to share your thoughts and help us improve.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-5">
            <FormField
              control={form.control}
              name="label"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Label" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEEDBACK_LABELS.map((label) => (
                          <SelectItem value={label.id} key={label.id}>
                            {label.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      cols={10}
                      placeholder="Tell us more about your feedback"
                      className="h-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="outline"
              className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
            >
              Submit Feedback
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackSheet;
