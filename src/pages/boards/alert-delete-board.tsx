import type {Board} from "~/utils/types";
import {api} from "~/utils/api";
import {useRouter} from "next/router";
import {toast} from "~/components/ui/use-toast";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import {Button} from "~/components/ui/button";
import {Trash} from "lucide-react";
import * as React from "react";

function AlertDeleteBoard({board}: { board: Board}) {
    const deleteMutation = api.board.deleteBoard.useMutation();
    const router = useRouter();
    async function deleteBoard() {
        const deleteBoard = await deleteMutation.mutateAsync({boardId: board.id});
        if (deleteBoard) {
            void router.push('/boards');
            toast({
                title: "Sucesso!",
                description: "Quadro deletado com sucesso.",
            })
        } else {
            toast({
                title: "Erro!",
                description: "Erro ao deletar quadro.",
            })
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} className={"w-full items-center mt-2"}>
                    <Trash className={"mr-2"}/>Desfazer Quadro
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação é irreversivel! Todos os dados do quadro serão deletados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button variant={"destructive"} onClick={() => deleteBoard()}><Trash className={"mr-2"}/>Deletar</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDeleteBoard;
