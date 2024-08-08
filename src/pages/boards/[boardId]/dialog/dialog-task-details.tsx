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
import {CalendarIcon, Pen} from "lucide-react";
import {Button} from "~/components/ui/button";
import {Label} from "~/components/ui/label";
import {useState} from "react";
import DialogUpdateTask from "~/pages/boards/[boardId]/dialog/dialog-update-task";
import AlertRemoveTask from "~/pages/boards/[boardId]/dialog/alert-remove-task";

function DialogTasktDetails({taskUpdate, users, isOpen, onClose, fetchTasks}: {taskUpdate: Task, users?: User[], isOpen: boolean, onClose: () => void, fetchTasks: () => void}) {
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

                    <Card className="w-full h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>{taskUpdate.title}</CardTitle>
                            <Separator/>
                        </CardHeader>
                        <CardContent className={"max-w-[400px]"}>
                            {taskUpdate.estimatedDate ?? taskUpdate.responsible ?
                                <div className="flex justify-between">
                                    <span className="flex justify-end items-center">
                                        <Avatar className="w-[30px] h-[30px]">
                                            <AvatarImage src={taskUpdate?.responsible?.image ?? undefined} />
                                        </Avatar>
                                        <p className="text-sm text-foreground px-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                            {taskUpdate?.responsible?.name}
                                        </p>
                                    </span>
                                    <div>
                                        {taskUpdate.estimatedDate ?
                                            <Button
                                                variant={"ghost"}
                                                className={cn(
                                                    "w-auto pl-3 text-left font-normal",
                                                    !taskUpdate.estimatedDate && "text-muted-foreground"
                                                )}>
                                                {format(taskUpdate.estimatedDate, "dd/MM/yyyy")}
                                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50"/>
                                            </Button> : <></>}
                                    </div>
                                </div>
                                : <></>}
                            <div className=" mt-3 rounded-lg p-2 flex-wrap items-center">
                                <div className="grid w-full gap-1.5">
                                    { taskUpdate?.description &&
                                     <>
                                        <Label htmlFor="description">Descrição</Label>
                                        <p className="break-words max-w-[300px]">{taskUpdate?.description}</p>
                                     </>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <div className="flex w-full  justify-between items-center mx-2">
                                <Button variant={"default"} className={"w-full mr-2 items-center"} onClick={() => {
                                    setIsDialogUpdateOpen(true)
                                }}>
                                <Pen className={"mr-2"}/>Editar
                                </Button>
                                <AlertRemoveTask task={taskUpdate} onClose={onClose} fetchTasks={fetchTasks}/>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                {isDialogUpdateOpen && taskUpdate &&
                    <DialogUpdateTask taskUpdate={taskUpdate} users={users} isOpen={isDialogUpdateOpen}
                                      onClose={() => setIsDialogUpdateOpen(false)} onCloseDialogDetails={onClose} fetchTasks={fetchTasks}/>}
            </DialogContent>
        </Dialog>
    );
}

export default DialogTasktDetails;