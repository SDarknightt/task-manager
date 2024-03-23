import {Task, User} from "~/utils/types";
import {api} from "~/utils/api";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "~/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {cn} from "~/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "~/components/ui/calendar";
import * as React from "react";

type FormValues = {
    taskId: string;
    title: string;
    description?: string;
    responsibleId?: string;
    estimatedDate?: Date;
}

export function DialogUpdateTask({taskUpdate, users, isOpen, onClose}: {taskUpdate: Task, users?: User[], isOpen: boolean, onClose: () => void}) {
    const apiMutation = api.task.updateTask.useMutation();

    const formSchema = z.object({
        taskId: z.string(),
        title: z.string().min(4, {message: 'Título deve ter no mínimo 4 caracteres.'}),
        description: z.string().max(255,"Descrição pode ter no máximo 255 letras.").optional(),
        responsibleId: z.string().optional(),
        estimatedDate: z.date().optional(),
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskId: taskUpdate.id,
            title: taskUpdate.title,
            responsibleId: taskUpdate.responsibleId ? taskUpdate.responsibleId : '',
            description: taskUpdate.description ? taskUpdate.description : '',
            estimatedDate: taskUpdate.estimatedDate ? taskUpdate.estimatedDate : undefined,
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            if(!data.responsibleId){
                data.responsibleId = undefined;
            }
            const updateTask = await apiMutation.mutateAsync({
                taskId: taskUpdate.id,
                title: data.title,
                description: data.description,
                responsibleId: data.responsibleId,
                estimatedDate: data.estimatedDate,
            });
            form.reset();
            if (updateTask) {
                onClose();
                toast({
                    title: "Sucesso!",
                    description: "Tarefa atualizada com sucesso.",
                })
            } else {
                toast({
                    title: "Erro!",
                    description: "Erro ao atualizar tarefa.",
                })
            }
            form.reset();
        } catch (error) {
            console.error(error, 'Error updating taskUpdate');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            form.reset();
            onClose();
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detalhes da Tarefa</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input{...field}/>
                                    </FormControl>
                                    <FormDescription>
                                        Título para identificar a tarefa.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Insira a descrição..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Descreva sobre o que se trata o tarefa.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {users ? <FormField
                            control={form.control}
                            name="responsibleId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Responsável</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={taskUpdate?.responsible?.name ? taskUpdate?.responsible?.name : "Selecione um responsável"}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {users?.map((user: User) => {
                                                return (
                                                    <SelectItem value={user.id} key={user.id}>{user.name}</SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        /> : <></>}

                        <FormField
                            control={form.control}
                            name="estimatedDate"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de Finalização</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-auto pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Selecione a data</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Selecione a data estimada para finalização da tarefa.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className={"w-full"}>Atualizar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}