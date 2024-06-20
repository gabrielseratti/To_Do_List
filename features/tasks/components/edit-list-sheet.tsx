import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ListForm } from "./task-form";
import { z } from "zod";
import { insertListSchema } from "@/db/schema";
import { useOpenList } from "../hooks/use-open-list";
import { useGetList } from "../api/use-get-list";
import { Loader2 } from "lucide-react";
import { useEditList } from "../api/use-edit-list";
import { useDeleteList } from "../api/use-delete-list";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertListSchema.pick({
    name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditListSheet = () => {
    const { isOpen, onClose, id } = useOpenList();

    const [ConfirmDialog, confirm] = useConfirm(
        'Tem certeza?',
        'Você está prestes a deletar esta lista'
    )

    const listQuery = useGetList(id);
    const editMutation = useEditList(id);
    const deleteMutation = useDeleteList(id);

    const isPending =
        editMutation.isPending ||
        deleteMutation.isPending;

    const isLoading = listQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const defaultValues = listQuery.data ? {
        name: listQuery.data.name
    } : {
        name: ''
    }

    return (
        <>
            <ConfirmDialog />
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
                        disabled={isPending} 
                        defaultValues={defaultValues}
                        onDelete={onDelete}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}