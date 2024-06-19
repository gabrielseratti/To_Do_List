import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetLists = () => {
    const query = useQuery({
        queryKey: ["lists"],
        queryFn: async () => {
            const response = await client.api.lists.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch lists");
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
}