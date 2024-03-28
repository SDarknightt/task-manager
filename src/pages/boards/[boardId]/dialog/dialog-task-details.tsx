import {Task, User} from "~/utils/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "~/components/ui/dialog";
import * as React from "react";
import {format} from "date-fns";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Separator} from "~/components/ui/separator";
import {Avatar, AvatarImage} from "~/components/ui/avatar";
import {cn} from "~/lib/utils";
import {Archive, CalendarIcon, PackageOpen, Pen, Trash} from "lucide-react";
import {Button} from "~/components/ui/button";
import {Label} from "~/components/ui/label";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import {api} from "~/utils/api";
import {toast} from "~/components/ui/use-toast";
import {useState} from "react";
import {DialogUpdateTask} from "~/pages/boards/[boardId]/dialog/dialog-update-task";

export function DialogTasktDetails({taskUpdate, users, isOpen, onClose}: {taskUpdate: Task, users?: User[], isOpen: boolean, onClose: () => void}) {

    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            onClose();
        }}>
            <DialogContent className="max-w-[425px] min-h-[400px]">
                <DialogHeader>
                    <DialogTitle>Detalhes da Tarefa</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col justify-start min-h-[300px]">

                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle>{taskUpdate.title}</CardTitle>
                            <Separator/>
                        </CardHeader>
                        <CardContent className={"max-w-[400px]"}>
                            {taskUpdate.estimatedDate ?? taskUpdate.responsible ?
                                <div className="flex justify-between">
                                    <div>
                                        {taskUpdate.estimatedDate ?
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-auto pl-3 text-left font-normal",
                                                    !taskUpdate.estimatedDate && "text-muted-foreground"
                                                )}>
                                                {format(taskUpdate.estimatedDate, "dd/MM/yyyy")}
                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                            </Button> : <></>}
                                    </div>
                                    <span className="flex justify-end items-center">
                                        <Avatar className="w-[30px] h-[30px]">
                                            <AvatarImage src={taskUpdate?.responsible?.image}/>
                                        </Avatar>
                                        <p className="text-sm text-foreground px-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                            {taskUpdate?.responsible?.name}
                                        </p>
                                    </span>
                                </div>
                                : <></>}
                                <div className=" mt-3 rounded-lg p-2 flex-wrap items-center">
                                    <div className="grid w-full gap-1.5">
                                        <Label htmlFor="description">Descrição</Label>
                                        <p className="break-words max-w-[300px]">{taskUpdate?.description}</p>
                                    </div>
                                </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <div className="flex w-full  justify-between items-center mx-2">
                                <Button variant={"default"} className={"w-full mr-2 items-center"} onClick={() => { setIsDialogUpdateOpen(true) }}>
                                    <Pen className={"mr-2"}/>Editar
                                </Button>
                                <AlertRemoveTask task={taskUpdate} onClose={onClose}/>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                {isDialogUpdateOpen && taskUpdate &&
                    <DialogUpdateTask taskUpdate={taskUpdate} users={users} isOpen={isDialogUpdateOpen}
                                      onClose={() => setIsDialogUpdateOpen(false)} onCloseDialogDetails={onClose}/>}
            </DialogContent>
        </Dialog>
    );
}


export function AlertRemoveTask({task, onClose}: { task: Task, onClose: () => void }) {
    const deleteMutation = api.task.deleteTask.useMutation();
    const disableMutation = api.task.disableTask.useMutation();

    async function disableTask(taskId: string){
        const disableTask = await disableMutation.mutateAsync({taskId: taskId});
        if (disableTask) {
            onClose();
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
        const deleteTask = await deleteMutation.mutateAsync({taskId: taskId});
        if (deleteTask) {
            onClose();
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