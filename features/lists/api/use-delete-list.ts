import { toast } from "sonner"

import { client } from "@/lib/hono"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists[':id']['$delete']>;

export const useDeleteList = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.lists[':id']['$delete']({ 
                param: { id } 
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Lista deletada")
            queryClient.invalidateQueries({ queryKey: ["list", { id }] })
            queryClient.invalidateQueries({ queryKey: ["lists"] })
            queryClient.invalidateQueries({ queryKey: ["tasks"] })
        },
        onError: () => {
            toast.error("Falha ao deletar lista")
        },
    });

    return mutation;
}