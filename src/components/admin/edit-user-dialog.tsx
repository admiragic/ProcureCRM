
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import type { User } from "@/lib/users";
import { useEffect } from "react";

/**
 * Props for the EditUserDialog component.
 * @property {boolean} isOpen - Whether the dialog is open.
 * @property {(open: boolean) => void} setIsOpen - Function to set the open state of the dialog.
 * @property {User} user - The user object to be edited.
 * @property {(user: User) => void} onUserUpdated - Callback function executed after a user is successfully updated.
 */
interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
  onUserUpdated: (user: User) => void;
}

// Zod schema for validating the user edit form.
const userFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  username: z.string().min(4, "Username must be at least 4 characters."),
  role: z.enum(["admin", "user"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

/**
 * A dialog component for editing user information.
 * @param {EditUserDialogProps} props - The component props.
 * @returns {React.ReactElement} The rendered dialog.
 */
export function EditUserDialog({ isOpen, setIsOpen, user, onUserUpdated }: EditUserDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { updateUser } = useAuth();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
  });

  /**
   * Effect to reset the form with the user's data whenever the user prop changes.
   */
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    }
  }, [user, form]);

  /**
   * Handles the form submission for updating a user.
   * @param {UserFormValues} values - The validated form values.
   */
  async function onSubmit(values: UserFormValues) {
    try {
      const updatedUser = { ...user, ...values };
      await updateUser(updatedUser);
      onUserUpdated(updatedUser);
      toast({
        title: "User Updated",
        description: `User ${values.name} has been successfully updated.`,
      });
      setIsOpen(false); // Close the dialog on success
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin_page.form_name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_email')}</FormLabel>
                    <FormControl>
                      {/* Email is disabled because changing it in Firebase Auth is a sensitive operation */}
                      <Input placeholder={t('admin_page.form_email_placeholder')} {...field} disabled />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('admin_page.form_username_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin_page.form_role')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">{t('admin_page.form_role_user')}</SelectItem>
                        <SelectItem value="admin">{t('admin_page.form_role_admin')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
