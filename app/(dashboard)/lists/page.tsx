"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetLists } from "@/features/lists/api/use-get-lists";
import { useNewList } from "@/features/lists/hooks/use-new-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteLists } from "@/features/lists/api/use-bulk-delete";


const ListsPage = () => {
    const newList = useNewList();
    const deleteLists = useBulkDeleteLists()
    const listsQuery = useGetLists();
    const lists = listsQuery.data || [];

    const isDisabled = 
      listsQuery.isLoading ||
      deleteLists.isPending;

    if (listsQuery.isLoading) {
      return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48"/>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin"/>
              </div>
            </CardContent>
          </CardHeader>
          </Card>
        </div>
      )
    }

    return ( 
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Página de Tarefas
                    </CardTitle>
                    <Button onClick={newList.onOpen} size={"sm"}>
                        <Plus className="size-4 mr-2"/>
                        Adicionar nova
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    filterKey="email"
                    columns={columns} 
                    data={lists} 
                    onDelete={(row) => {
                      const ids = row.map((r) => r.original.id);
                      deleteLists.mutate({ ids });
                    }}
                    disabled={isDisabled} />    
                </CardContent>
            </Card>
        </div>
     );
}
 
export default ListsPage;