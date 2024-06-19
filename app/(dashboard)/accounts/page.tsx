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
import { useGetLists } from "@/features/accounts/api/use-get-lists";
import { useNewList } from "@/features/accounts/hooks/use-new-list";
import { Skeleton } from "@/components/ui/skeleton";


const AccountsPage = () => {
    const newAccount = useNewList();
    const listsQuery = useGetLists();
    const lists = listsQuery.data || [];

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
                        Tarefas
                    </CardTitle>
                    <Button onClick={newAccount.onOpen} size={"sm"}>
                        <Plus className="size-4 mr-2"/>
                        Adicionar nova
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    filterKey="email"
                    columns={columns} 
                    data={lists} 
                    onDelete={() => {}}
                    disabled={false} />    
                </CardContent>
            </Card>
        </div>
     );
}
 
export default AccountsPage;