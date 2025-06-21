// generateplanAction.ts
// Converted to plain Node.js TypeScript (no Next.js, no React)
// Adds error handling and type checks for NewPlanForm compatibility

import { differenceInDays } from "date-fns";

export interface DatesOfTravel {
  from: string | Date;
  to: string | Date;
}

export interface GeneratePlanFormData {
  placeName: string;
  activityPreferences: string[];
  datesOfTravel: DatesOfTravel;
  companion?: string;
  userId?: string;
}

// Dummy getAuthToken for demonstration (replace with your own logic)
async function getAuthToken(): Promise<string> {
  // Return a static or mock token for now
  return "mock-token";
}

export async function generatePlanAction(
  formData: GeneratePlanFormData
): Promise<string | null> {
  try {
    // Type checks for dates
    if (
      !formData.datesOfTravel ||
      !formData.datesOfTravel.from ||
      !formData.datesOfTravel.to
    ) {
      console.error(
        "datesOfTravel, from, or to is missing in formData:",
        formData
      );
      return null;
    }
    const fromDate =
      formData.datesOfTravel.from instanceof Date
        ? formData.datesOfTravel.from
        : new Date(formData.datesOfTravel.from);
    const toDate =
      formData.datesOfTravel.to instanceof Date
        ? formData.datesOfTravel.to
        : new Date(formData.datesOfTravel.to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      console.error("Invalid date(s) in formData:", formData);
      return null;
    }

    const token = await getAuthToken();
    const { placeName, activityPreferences, companion, userId } = formData;

    // Remove credits check for now
    // const userRes = await fetch("http://localhost:3000/api/users/me", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // const userData = userRes.ok ? await userRes.json() : null;
    // const totalCredits = (userData?.credits ?? 0) + (userData?.freeCredits ?? 0);
    // if (totalCredits <= 0) {
    //   console.log(
    //     `unable to create ai travel plan due to low credits user:${userData?.userId}`
    //   );
    //   return null;
    // }

    // Create AI plan
    const planRes = await fetch("http://localhost:3000/api/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        placeName,
        noOfDays: (differenceInDays(toDate, fromDate) + 1).toString(),
        activityPreferences,
        fromDate: fromDate.getTime(),
        toDate: toDate.getTime(),
        companion,
        isGeneratedUsingAI: true,
      }),
    });
    if (!planRes.ok) {
      const errorText = await planRes.text();
      console.error("Failed to create plan:", planRes.status, errorText);
      return null;
    }
    const planData = await planRes.json();
    const planId = planData?.planId;
    if (!planId) {
      console.error("No planId returned from API:", planData);
      return null;
    }

    // Trigger retrier actions (images, batch1, batch2, batch3)
    const retrierEndpoints = [
      { url: "http://localhost:3000/api/retrier/images", body: { prompt: placeName, planId } },
      { url: "http://localhost:3000/api/retrier/prepareBatch1", body: { planId } },
      { url: "http://localhost:3000/api/retrier/prepareBatch2", body: { planId } },
      { url: "http://localhost:3000/api/retrier/prepareBatch3", body: { planId } },
    ];
    for (const { url, body } of retrierEndpoints) {
      const retrierRes = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!retrierRes.ok) {
        const errorText = await retrierRes.text();
        console.error(`Failed to trigger ${url}:`, retrierRes.status, errorText);
      }
    }

    // Reduce user credits
    const creditsRes = await fetch("http://localhost:3000/api/users/reduce-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!creditsRes.ok) {
      const errorText = await creditsRes.text();
      console.error("Failed to reduce user credits:", creditsRes.status, errorText);
    }

    // Return the planId
    return planId;
  } catch (err) {
    console.error("Error in generatePlanAction:", err);
    return null;
  }
}
