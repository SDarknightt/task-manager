import {Task} from "~/utils/types";
import {api} from "~/utils/api";
import {toast} from "~/components/ui/use-toast";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import {Button} from "~/components/ui/button";
import {Archive, PackageOpen, Trash} from "lucide-react";
import * as React from "react";

export function AlertRemoveTask({task, onClose, fetchTasks}: { task: Task, onClose: () => void, fetchTasks: () => void}) {
    const deleteMutation = api.task.deleteTask.useMutation();

    const disableMutation = api.task.disableTask.useMutation();

    async function disableTask(taskId: string){
        const disableTask = await disableMutation.mutateAsync({taskId: taskId});
        if (disableTask) {
            onClose();
            fetchTasks();
            toast({
                title: "Sucesso!",
                description: "Tarefa archivada com sucesso.",
            })
        } else {
            toast({
                title: "Erro!",
                description: "Erro ao archivar tarefa.",
            })
        }
    }
    async function deleteTask(taskId: string) {
        console.log("taskId", taskId);
        const deleteTask = await deleteMutation.mutateAsync({taskId: taskId});
        if (deleteTask) {
            onClose();
            fetchTasks();
            toast({
                title: "Sucesso!",
                description: "Tarefa deletada com sucesso.",
            })
        } else {
            toast({
                title: "Erro!",
                description: "Erro ao deletar tarefa.",
            })
        }
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} className={"w-full items-center"}>
                    <PackageOpen className={"mr-2"}/>Remover
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você pode excluir permanetemente ou arquivar para visualizar posteriormente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button variant={"destructive"} onClick={() => deleteTask(task.id)}><Trash className={"mr-2"}/>Deletar</Button>
                    <Button variant={"secondary"} className={"bg-yellow-500 text-white"} onClick={() => disableTask(task.id)}><Archive className={"mr-2"}/>Arquivar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}