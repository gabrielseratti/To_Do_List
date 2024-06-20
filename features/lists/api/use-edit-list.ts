import { toast } from "sonner"

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists[':id']['$patch']>;
type RequestType = InferRequestType<typeof client.api.lists[':id']['$patch']>["json"];

export const useEditList = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.lists[':id']['$patch']({ 
                json, 
                param: { id } 
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Lista atualizada")
            queryClient.invalidateQueries({ queryKey: ["lists", { id }] })
            queryClient.invalidateQueries({ queryKey: ["lists"] })
        },
        onError: () => {
            toast.error("Falha ao atualizar lista")
        },
    });

    return mutation;
}