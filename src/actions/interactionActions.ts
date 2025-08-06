
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { revalidatePath } from 'next/cache';

const interactionFormSchema = z.object({
    clientId: z.string().min(1),
    type: z.enum(["call", "email", "meeting", "demo"]),
    salesperson: z.string().min(2),
    notes: z.string().min(10),
});

export async function addInteractionAction(values: z.infer<typeof interactionFormSchema>) {
    const validatedFields = interactionFormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const interactionsRef = ref(db, 'interactions');
    const newInteractionRef = push(interactionsRef);

    try {
        await set(newInteractionRef, {
            ...validatedFields.data,
            date: serverTimestamp()
        });
        revalidatePath('/interactions');
        return { message: 'Interaction added successfully' };
    } catch (error) {
        return { error: 'Failed to add interaction' };
    }
}
