'use client'
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import * as React from "react";
import {api} from "~/utils/api";
import {toast} from "~/components/ui/use-toast";

type FormValues = {
    title: string;
    description: string | undefined;
};

export default function DialogCreateBoard() {

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Criar Quadro</Button>
            </DialogTrigger>
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
                                        <Input placeholder="Insira o título..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Título para identificar o quadro.
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
                                        <Input placeholder="Insira a descrição..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Descreva sobre o que se trata o quadro.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Criar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}