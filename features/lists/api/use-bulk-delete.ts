import { toast } from "sonner"

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists['bulk-delete']['$post']>;
type RequestType = InferRequestType<typeof client.api.lists['bulk-delete']['$post']>["json"];

export const useBulkDeleteLists = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.lists['bulk-delete']['$post']({ json })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Listas deletadas")
            queryClient.invalidateQueries({ queryKey: ["lists"] })
        },
        onError: () => {
            toast.error("Falha ao criar lista")
        },
    });

    return mutation;
}