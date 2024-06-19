import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewAccount } from "../hooks/use-new-account";
import { AccountForm } from "./account-form";
import { z } from "zod";
import { insertAccountSchema } from "@/db/schema";
import { useCreateAccount } from "../api/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Nova Lista
                    </SheetTitle>
                    <SheetDescription>
                        Crie uma nova lista com suas tarefas.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                onSubmit={onSubmit} 
                disabled={mutation.isPending} 
                defaultValues={{
                    name: ""
                }}/>
            </SheetContent>
        </Sheet>
    )
}