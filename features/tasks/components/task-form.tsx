import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTaskSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
    date: z.coerce.date().nullable().optional(),
    name: z.string(), 
    listId: z.string(),
    notes: z.string().nullable().optional(),
});

const apiSchema = insertTaskSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    listOptions: { label: string; value: string; }[];
    onCreateList: (name: string) => void;
};

export const TaskForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    listOptions,
    onCreateList
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => { 
        onSubmit({...values});
    };

    const handleDelete = () => {
        onDelete?.();
    }

    return (
        <Form {...form}> 
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField 
                name="listId" 
                control={form.control} 
                render={({ field }) => (
                    <FormItem> 
                        <FormLabel>
                            Lista
                        </FormLabel>
                        <FormControl>
                            <Select 
                                placeholder="Selecione uma lista"
                                options={listOptions}
                                onCreate={onCreateList}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )} />
                <FormField 
                name="date" 
                control={form.control} 
                render={({ field }) => (
                    <FormItem> 
                        <FormLabel>
                            Data
                        </FormLabel>
                        <FormControl>
                            <DatePicker 
                                value={field.value as Date | null} 
                                onChange={field.onChange}
                                disabled={disabled}
                            />
                        </FormControl>
                    </FormItem>
                )} />
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Tarefa
                        </FormLabel>
                        <FormControl>
                            <Input 
                            disabled={disabled} 
                            placeholder="Adicione uma tarefa" 
                            {...field} />
                        </FormControl>
                    </FormItem>
                )} />
                <FormField name="notes" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Notas
                        </FormLabel>
                        <FormControl>
                            <Textarea 
                                {...field} 
                                value={field.value ?? ""}
                                disabled={disabled} 
                                placeholder="Notas opcionais" 
                            />
                        </FormControl>
                    </FormItem>
                )} />
                <Button className="w-full" disabled={disabled} >
                    {id ? "Salvar mudanças" : "Criar tarefa"}
                </Button>
                {!!id && (
                    <Button 
                    type="button" 
                    disabled={disabled} 
                    onClick={handleDelete} 
                    className="w-full" 
                    variant={"outline"}>
                        <Trash className="size-4 mr-2" />
                        Deletar tarefa
                    </Button>
                )
                }
            </form>
        </Form>
    )
}
