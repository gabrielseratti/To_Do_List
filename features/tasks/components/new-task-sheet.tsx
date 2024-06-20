import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  
import { z } from "zod";
import { insertTaskSchema } from "@/db/schema";
import { useNewTask } from "../hooks/use-new-task";
import { useCreateTask } from "../api/use-create-task";
import { useGetLists } from "@/features/lists/api/use-get-lists";
import { useCreateList } from "@/features/lists/api/use-create-list"; 
import { TaskForm } from "./task-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTaskSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTaskSheet = () => {
    const { isOpen, onClose } = useNewTask();

    const createMutation = useCreateTask();

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
        createMutation.isPending ||
        listMutation.isPending;

    const isLoading = 
        listQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
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
                        Nova Tarefa
                    </SheetTitle>
                    <SheetDescription>
                        Adicione uma nova tarefa.
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin"/>
                        </div>
                    )
                    : (
                        <TaskForm 
                            onSubmit={onSubmit}
                            disabled={isPending}
                            listOptions={listOptions}
                            onCreateList={onCreateList}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    )
}