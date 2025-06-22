"use client";

import { useToast } from "@/frontend/components/ui/use-toast";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import joinNow from "@/public/join-now.svg";

const Join = () => {
  // TODO: Replace with your own user logic
  const isLoaded = true;
  const isSignedIn = true;
  const user = { id: "mock-user" };
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded || !token) return;
    if (!isSignedIn) {
      router.push("/");
    }
    // TODO: Implement your own grant access logic here
    // router.push(`/plans/${planId}/plan`);
  }, [isLoaded, isSignedIn, token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src={joinNow} alt="Join Now" width={200} height={200} />
      <h1 className="text-2xl font-bold mt-4">Join a Plan</h1>
      {/* Add your join logic here */}
    </div>
  );
};

export default Join;
