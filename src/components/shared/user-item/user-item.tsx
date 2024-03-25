'use client';
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import * as React from "react";
import {Button} from "~/components/ui/button";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import {api} from "~/utils/api";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {LogOut} from "lucide-react";

export default function UserItem(){
    const { data: sessionData } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(false);
    }

    const handleOpen = () => {
        setIsOpen(true);
    }

    return (
        <div className="flex items-center justify-center gap-2 border rounded-[40px] p-4" onClick={handleOpen}>
            <div className="avatar rounded-full min-h-12 min-w-12 bg-emerald-500 text-white flex item items-center font-[700] justify-center">
                { sessionData?.user?.image ?
                    <p>
                        <Avatar>
                            <AvatarImage className="rounded-[40px]" src={sessionData?.user?.image}/>
                            <AvatarFallback>{sessionData?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </p> :
                    <p className="text-[25px]">
                        {sessionData?.user?.name?.charAt(0)}
                    </p>
                }
            </div>
            <div>
                <p className="text-[16px] font-bold">{sessionData?.user?.name}</p>
                <p className="text-[14px] text-neutral-500">{sessionData?.user?.email}</p>
            </div>
            {isOpen && <DialogUserItem onClose={handleClose}/>}
        </div>
    );
}

interface DialogUserItemProps {
    onClose: () => boolean | undefined | void;
}
export function DialogUserItem({onClose}: DialogUserItemProps) {
    const { data: sessionData } = useSession();

    return (
        <Dialog defaultOpen={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogClose className="absolute right-4 top-4" onClick={onClose} />
                <DialogHeader>
                    <DialogTitle>Perfil</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col items-center">
                        <div className="justify-self-center">
                            <Avatar className={"min-h-[80px] min-w-[80px]"}>
                                <AvatarImage className="rounded-[40px] min-h-2 min-w-2 object-cover"
                                             src={sessionData?.user?.image}/>
                                <AvatarFallback>{sessionData?.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <h4 className="font-bold text-lg mt-5"> {sessionData?.user?.name}</h4>
                        <h3 className="font-bold">{sessionData?.user?.email}</h3>
                        <DialogShareId/>
                        <Button variant={"destructive"} className="min-w-32" onClick={() => signOut()}><LogOut className={"mr-2"}/>Sair</Button>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}

export function DialogShareId() {
    const [shareId, setShareId] = useState(null as unknown as number);
    const userMutation = api.user.generateShareId.useMutation();
    useEffect(() => {
        void userMutation.mutateAsync({}).then(id => {
            if(id){
                setShareId(id);
            }
        });
        return () => {
            setShareId(null as unknown as number);
        }
    }, []);
    return (
        <AlertDialog>
            <AlertDialogTrigger><Button className="my-3">Gerar código de convite</Button></AlertDialogTrigger>
            <AlertDialogContent className="flex-col flex items-center">
                <AlertDialogHeader className="flex-col flex items-center">
                    <AlertDialogTitle>Código de convite</AlertDialogTitle>
                    <AlertDialogDescription className="flex-col flex items-center">
                        Utilize esse código para estabeler conexão com outros usuários.
                        <h1 className="font-bold text-xl">{shareId}</h1>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Fechar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}