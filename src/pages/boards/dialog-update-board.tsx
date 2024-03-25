import {type Board, type User} from "~/utils/types";
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
import * as React from "react";
import {Textarea} from "~/components/ui/text-area";

type FormValues = {
    boardId: string;
    title: string;
    description?: string;
}

export function DialogUpdateBoard({board, users, isOpen, onClose, refetchBoard}: {board: Board, users?: User[], isOpen: boolean, onClose: () => void, refetchBoard: () => void}){
    const apiMutation = api.board.updateBoard.useMutation();

    const formSchema = z.object({
        boardId: z.string(),
        title: z.string().min(4, {message: 'Título deve ter no mínimo 4 caracteres.'}),
        description: z.string().max(100,"Descrição pode ter no máximo 100 letras.").optional(),
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            boardId: board.id,
            title: board.title,
            description: board.description ? board.description : '',
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            const updateBoard = await apiMutation.mutateAsync({
                boardId: board.id,
                title: data.title,
                description: data.description,
            });
            if (updateBoard) {
                onClose();
                toast({
                    title: "Sucesso!",
                    description: "Quadro atualizado com sucesso.",
                })
            } else {
                toast({
                    title: "Erro!",
                    description: "Erro ao atualizar quadro.",
                })
            }
            refetchBoard();
            form.reset();
        } catch (error) {
            console.error(error, 'Error updating board');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            form.reset();
            onClose();
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detalhes do Quadro</DialogTitle>
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
                                        Título para identificar o quadro.
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
                                        <Textarea className="text-foreground" placeholder={"Insira a descrição"} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Descreva sobre o que se trata quadro.
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