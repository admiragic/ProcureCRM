
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { revalidatePath } from 'next/cache';

const clientFormSchema = z.object({
    companyName: z.string().min(2),
    contactPerson: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    address: z.string().min(5),
    industry: z.string().min(2),
    type: z.enum(["lead", "prospect", "customer"]),
    status: z.enum(["active", "inactive", "archived"]),
});

export async function addClientAction(values: z.infer<typeof clientFormSchema>) {
    const validatedFields = clientFormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    if (!db) {
        return { error: 'Database not configured' };
    }

    const clientsRef = ref(db, 'clients');
    const newClientRef = push(clientsRef);
    
    try {
        await set(newClientRef, {
            ...validatedFields.data,
            createdAt: serverTimestamp(),
        });
        revalidatePath('/clients');
        return { message: 'Client added successfully' };
    } catch (error) {
        return { error: 'Failed to add client' };
    }
}
