import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListForm } from "./list-form";
import { z } from "zod";
import { insertListSchema } from "@/db/schema";
import { useCreateList } from "../api/use-create-list";
import { useOpenList } from "../hooks/use-open-list";
import { useGetList } from "../api/use-get-list";
import { Loader2 } from "lucide-react";

const formSchema = insertListSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditListSheet = () => {
    const { isOpen, onClose, id } = useOpenList();

    const listQuery = useGetList(id);
    const mutation = useCreateList();

    const isLoading = listQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const defaultValues = listQuery.data ? {
        name: listQuery.data.name
    } : {
        name: ''
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Editar tarefa
                    </SheetTitle>
                    <SheetDescription>
                        Editar uma tarefa existente.
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <ListForm 
                    id={id}
                    onSubmit={onSubmit} 
                    disabled={mutation.isPending} 
                    defaultValues={defaultValues}/>
                )}
            </SheetContent>
        </Sheet>
    )
}