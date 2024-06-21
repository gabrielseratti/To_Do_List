import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewList } from "../hooks/use-new-list";
import { ListForm } from "./list-form";
import { z } from "zod";
import { insertListSchema } from "@/db/schema";
import { useCreateList } from "../api/use-create-list";

const formSchema = insertListSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewListSheet = () => {
    const { isOpen, onClose } = useNewList();

    const mutation = useCreateList();

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
                        Crie uma nova lista para suas tarefas.
                    </SheetDescription>
                </SheetHeader>
                <ListForm 
                onSubmit={onSubmit} 
                disabled={mutation.isPending} 
                defaultValues={{
                    name: ""
                }}/>
            </SheetContent>
        </Sheet>
    )
}