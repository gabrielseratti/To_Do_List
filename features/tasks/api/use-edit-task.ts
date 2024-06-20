import { toast } from "sonner"

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks[':id']['$patch']>;
type RequestType = InferRequestType<typeof client.api.tasks[':id']['$patch']>["json"];

export const useEditTask = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.tasks[':id']['$patch']({ 
                json, 
                param: { id } 
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Tarefa atualizada")
            queryClient.invalidateQueries({ queryKey: ["tasks", { id }] })
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: () => {
            toast.error("Falha ao atualizar Tarefa")
        },
    });

    return mutation;
}