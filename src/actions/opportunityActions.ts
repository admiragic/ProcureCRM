'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { revalidatePath } from 'next/cache';

const opportunityFormSchema = z.object({
    clientId: z.string().min(1),
    stage: z.enum(["lead", "prospecting", "proposal", "negotiation", "won", "lost"]),
    value: z.coerce.number().min(0),
    closingDate: z.string(), // Already formatted as yyyy-MM-dd
});

export async function addOpportunityAction(values: z.infer<typeof opportunityFormSchema>) {
    const validatedFields = opportunityFormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const newOppRef = push(ref(db, 'opportunities'));

    try {
        await set(newOppRef, validatedFields.data);
        revalidatePath('/opportunities');
        return { message: 'Opportunity added successfully' };
    } catch (error) {
        return { error: 'Failed to add opportunity' };
    }
}
