// generateEmptyPlanAction.ts
// Converted to plain Node.js TypeScript (no Next.js, no React)

import { differenceInDays } from 'date-fns';

// Dummy getAuthToken for demonstration (replace with your own logic)
async function getAuthToken(): Promise<string> {
    // Return a static or mock token for now
    return 'mock-token';
}

// Default credits for new users
const DEFAULT_CREDITS = 10;

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

/**
 * Generates an empty plan and sets default credits for the user.
 * @param formData The form data for the plan.
 * @returns The new plan ID or null if failed.
 */
export async function generateEmptyPlanAction(formData: GeneratePlanFormData): Promise<string | null> {
    try {
        // Type checks for dates
        if (!formData.datesOfTravel || !formData.datesOfTravel.from || !formData.datesOfTravel.to) {
            console.error('datesOfTravel, from, or to is missing in formData:', formData);
            return null;
        }
        const fromDate = formData.datesOfTravel.from instanceof Date ? formData.datesOfTravel.from : new Date(formData.datesOfTravel.from);
        const toDate = formData.datesOfTravel.to instanceof Date ? formData.datesOfTravel.to : new Date(formData.datesOfTravel.to);
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            console.error('Invalid date(s) in formData:', formData);
            return null;
        }

        const token = await getAuthToken();
        const { placeName, activityPreferences, companion, userId } = formData;

        // Create empty plan
        const planRes = await fetch('http://localhost:3000/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                placeName,
                noOfDays: (differenceInDays(toDate, fromDate) + 1).toString(), // FIXED: correct calculation
                activityPreferences,
                fromDate: fromDate.getTime(),
                toDate: toDate.getTime(),
                companion,
                isGeneratedUsingAI: false
            }),
        });
        if (!planRes.ok) {
            const errorText = await planRes.text();
            console.error('Failed to create plan:', planRes.status, errorText);
            throw new Error(`Failed to create plan: ${planRes.status} ${errorText}`); // Throw error for better feedback
        }
        const planData = await planRes.json();
        const planId = planData?.planId;
        if (!planId) {
            console.error('No planId returned from API:', planData);
            return null;
        }

        // Set default credits for the user (if new)
        if (userId) {
            const creditsRes = await fetch('http://localhost:3000/api/users/credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, credits: DEFAULT_CREDITS }),
            });
            if (!creditsRes.ok) {
                const errorText = await creditsRes.text();
                console.error('Failed to set user credits:', creditsRes.status, errorText);
            }
        }

        // Trigger retrier action for images
        const retrierRes = await fetch('http://localhost:3000/api/retrier/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ prompt: placeName, planId }),
        });
        if (!retrierRes.ok) {
            const errorText = await retrierRes.text();
            console.error('Failed to trigger retrier/images:', retrierRes.status, errorText);
        }

        // Return the planId
        return planId;
    } catch (err) {
        console.error('Error in generateEmptyPlanAction:', err);
        return null;
    }
}