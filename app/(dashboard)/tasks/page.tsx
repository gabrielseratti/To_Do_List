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
import { Skeleton } from "@/components/ui/skeleton"; 
import { useNewTask } from "@/features/tasks/hooks/use-new-task";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useBulkDeleteTasks } from "@/features/tasks/api/use-bulk-delete-tasks";


const TasksPage = () => {
    const newTask = useNewTask();
    const deleteTasks = useBulkDeleteTasks()
    const tasksQuery = useGetTasks();
    const tasks = tasksQuery.data || [];

    const isDisabled = 
      tasksQuery.isLoading ||
      deleteTasks.isPending;

    if (tasksQuery.isLoading) {
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
                        Histórico de Tarefas
                    </CardTitle>
                    <Button onClick={newTask.onOpen} size={"sm"}>
                        <Plus className="size-4 mr-2"/>
                        Adicionar nova
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                    filterKey="name"
                    columns={columns} 
                    data={tasks} 
                    onDelete={(row) => {
                      const ids = row.map((r) => r.original.id);
                      deleteTasks.mutate({ ids });
                    }}
                    disabled={isDisabled} />    
                </CardContent>
            </Card>
        </div>
     );
}
 
export default TasksPage;