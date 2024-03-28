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
import * as React from "react";
import {api} from "~/utils/api";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "~/components/ui/input-otp";
import {toast} from "~/components/ui/use-toast";
import {Board} from "~/utils/types";
import {PlusIcon} from "lucide-react";

export default function DialogInsertUser({board, fetchUsers} : {board: Board, fetchUsers: () => void}) {
    return (
        <Dialog>
            <DialogTrigger asChild  className="border border-dashed flex items-center w-9 h-9 border-gray-500 justify-center rounded-full">
                <Button variant="ghost"><PlusIcon className="w-10 h-10 text-red-600"/>+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Inserir Usúario</DialogTitle>
                    <DialogDescription>
                        Insira usuários ao quadro.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center">
                    <AddUserInput board={board} fetchUsers={fetchUsers}/>
                </div>
            </DialogContent>
        </Dialog>
    )
}


export function AddUserInput({board, fetchUsers}: {board: Board, fetchUsers: () => void}) {
    const apiMutation = api.board.addUserToBoard.useMutation()

    const FormSchema = z.object({
        shareId: z.string().min(6, {
            message: "O código deve ter 6 caracteres!",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            shareId: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await apiMutation.mutateAsync({
            shareId: Number(data.shareId),
            boardId: board.id
        });
        if (response) {
            void fetchUsers();
            toast({
                title: "Sucesso!",
                description: "Usúario inserido com sucesso.",
            })
        } else {
            toast({
                title: "Falha!",
                description: "Falha ao inserir usuário.",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="shareId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Insira o código de 6 dígitos fornecido pelo usuário a ser inserido.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Inserir</Button>
            </form>
        </Form>
    )
}
