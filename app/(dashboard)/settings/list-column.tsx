import { useOpenList } from "@/features/lists/hooks/use-open-list";
import { cn } from "@/lib/utils";

type Props = { 
    list: string
    listId: string
};

export const ListColumn = ({ 
    list,
    listId,
}: Props) => {
    const { onOpen: onOpenList } = useOpenList();

    const onClick = () => {
        onOpenList(listId);
    }

    return (
        <div 
        onClick={onClick}
        className="flex items-center cursor-pointer hover:underline">
            {list}
        </div>
    );
}