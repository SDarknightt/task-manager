'use client'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
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
import * as React from "react";
import {api} from "~/utils/api";
import {toast} from "~/components/ui/use-toast";
import {Textarea} from "~/components/ui/text-area";

type FormValues = {
    title: string;
    description: string | undefined;
};

export default function DialogCreateBoard({isOpen, onClose, fetchBoards}:{isOpen: boolean, onClose:() => void, fetchBoards: () => void}) {

    const apiMutation = api.board.createBoard.useMutation();
    const formSchema = z.object({
        title: z.string().min(4, {message: 'Título deve ter no mínimo 4 caracteres.'}),
        description: z.string().max(255,"Descrição pode ter no máximo 255 letras.").optional()
    })
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            const createBoard = await apiMutation.mutateAsync({
                title: data.title,
                description: data.description,
            });
            if(createBoard){
                onClose();
                fetchBoards();
                toast({
                    title: "Sucesso!",
                    description: "Quadro criado com sucesso.",
                })
            } else{
                toast({
                    title: "Erro!",
                    description: "Erro ao criar quadro.",
                })
            }
            form.reset();
        } catch (error) {
            console.error(error, 'Error creating board');
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar Quadro</DialogTitle>
                    <DialogDescription>
                       Crie um novo quadro.
                    </DialogDescription>
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
                                        <Input placeholder="Insira o título" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Título para identificação do quadro
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
                                        <Textarea className="text-foreground" id="description" placeholder={"Insira a descrição"} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Descreva sobre o que se trata o quadro
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className={"w-full"}>Criar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}