import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TaskForm } from "./task-form";
import { z } from "zod";
import { insertTaskSchema } from "@/db/schema";
import { useOpenTask } from "../hooks/use-open-task";
import { useGetTask } from "../api/use-get-task";
import { Loader2 } from "lucide-react";
import { useEditTask } from "../api/use-edit-task";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetLists } from "@/features/lists/api/use-get-lists";
import { useCreateList } from "@/features/lists/api/use-create-list";

const formSchema = insertTaskSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTaskSheet = () => {
    const { isOpen, onClose, id } = useOpenTask();

    const [ConfirmDialog, confirm] = useConfirm(
        'Tem certeza?',
        'Você está prestes a deletar esta tarefa'
    )

    const taskQuery = useGetTask(id);
    const editMutation = useEditTask(id);
    const deleteMutation = useDeleteTask(id);

    const listQuery = useGetLists();
    const listMutation = useCreateList();
    const onCreateList = (name: string) => listMutation.mutate({
        name
    });
    const listOptions = (listQuery.data ?? []).map((list) => ({
        label: list.name,
        value: list.id,
    }));

    const isPending =
        editMutation.isPending ||
        deleteMutation.isPending ||
        taskQuery.isLoading ||
        listMutation.isPending;

    const isLoading = 
        taskQuery.isLoading ||
        listQuery.isLoading;

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

    const defaultValues = taskQuery.data ? {
        listId: taskQuery.data.listId,
        name: taskQuery.data.name,
        date: taskQuery.data.date 
        ? new Date(taskQuery.data.date)
        : new Date(),
        notes: taskQuery.data.notes,
    } : {
        listId: '',
        name: '',
        date: new Date(),
        notes: '',
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
                        <TaskForm 
                            id={id}
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            listOptions={listOptions}
                            onCreateList={onCreateList}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}