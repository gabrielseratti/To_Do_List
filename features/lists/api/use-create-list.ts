import { toast } from "sonner"

import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.lists.$post>;
type RequestType = InferRequestType<typeof client.api.lists.$post>["json"];

export const useCreateList = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.lists.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Lista criada")
            queryClient.invalidateQueries({ queryKey: ["lists"] })
        },
        onError: () => {
            toast.error("Falha ao criar listas")
        },
    });

    return mutation;
}