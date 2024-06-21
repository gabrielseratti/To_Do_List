import { toast } from "sonner"

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";


type ResponseType = InferResponseType<typeof client.api.tasks['bulk-delete']['$post']>;
type RequestType = InferRequestType<typeof client.api.tasks['bulk-delete']['$post']>["json"];

export const useBulkDeleteTasks = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.tasks['bulk-delete']['$post']({ json })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Tarefas deletadas")
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: () => {
            toast.error("Falha ao deletar Tarefas")
        },
    });

    return mutation;
}