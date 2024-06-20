import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"

export const useGetTasks = () => {
    const params = useSearchParams();
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const listId = params.get('listId') || '';

    const query = useQuery({
        queryKey: ["tasks", { from, to, listId }],
        queryFn: async () => {
            const response = await client.api.tasks.$get({
                query: {
                    from,
                    to,
                    listId
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}