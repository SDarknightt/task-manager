'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import * as React from "react";
import {Board, User} from "~/utils/types";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {api} from "~/utils/api";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "~/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "~/components/ui/select";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {cn} from "~/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "~/components/ui/calendar";
import {Textarea} from "~/components/ui/text-area";

type FormValues = {
    title: string;
    description?: string;
    responsibleId?: string | null;
    boardId: string;
    estimatedDate?: Date;
}

export default function DialogCreateTask({board, isOpen, onClose, fetchTasks} : {board: Board,isOpen: boolean, onClose: () => void, fetchTasks: () => void}) {
    const apiMutation = api.task.createTask.useMutation();
    const apiContext = api.useContext();
    const [users, setUsers] = useState([] as User[]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseUsers = await apiContext.user.getUsersBoard.fetch({boardId: board.id});
                if(responseUsers){
                    setUsers(responseUsers);
                }
            } catch (error) {
                throw new Error("Error fetching users client");
            }
        }
        void fetchUsers();
    }, []);

    const formSchema = z.object({
        boardId: z.string(),
        title: z.string().min(4, {message: 'Título deve ter no mínimo 4 caracteres.'}),
        description: z.string().max(100,"Descrição pode ter no máximo 100 letras.").optional(),
        responsibleId: z.string().optional(),
        estimatedDate: z.date().optional(),
    })
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            boardId: board.id,
            title: '',
            description: '',
            responsibleId: '',
            estimatedDate: undefined,
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            if(data.responsibleId === "without" || !data.responsibleId){
                data.responsibleId = null;
            }
            const createTask = await apiMutation.mutateAsync({
                title: data.title,
                description: data.description,
                boardId: board.id,
                responsibleId: data.responsibleId,
                estimatedDate: data.estimatedDate,
            });
            form.reset();
            if(createTask){
                onClose();
                fetchTasks();
                toast({
                    title: "Sucesso!",
                    description: "Tarefa criada com sucesso.",
                })
            } else {
                toast({
                    title: "Erro!",
                    description: "Erro ao criar tarefa.",
                })
            }
            form.reset();
        } catch (error) {
            console.error(error, 'Error creating task');
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={()=> {form.reset(); onClose();}}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Tarefa</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Insira o título..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Título para identificar a tarefa.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea className="text-foreground" placeholder={"Insira a descrição"} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Descreva sobre o que se trata o tarefa.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="responsibleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsável</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value!}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue="" placeholder="Selecione um responsável"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            <SelectItem key={"without"} value={"without"}>
                                                Sem responsável
                                            </SelectItem>
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
                        />

                        <FormField
                            control={form.control}
                            name="estimatedDate"
                            render={({ field }) => (
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
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">Criar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
