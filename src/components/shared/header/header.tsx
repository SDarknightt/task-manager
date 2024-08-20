import {
    LogOut,
    Moon,
    PanelLeftClose,
    PanelLeftOpen,
    Sun, User,
    MenuIcon, Share2
} from "lucide-react";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import { Menubar } from "~/components/ui/menubar";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {Button} from "~/components/ui/button";
import {signOut, useSession} from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import {api} from "~/utils/api";

import * as React from "react";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [filter, setFilter]  = useState('none')

    useEffect(() => {
        theme === 'light' ? setFilter(() => 'invert(95%)') : setFilter(() => '')
    }, [theme, filter])

    return (
        <Menubar className="menu-header rounded-none px-2 border-l-0 border-r-0 border-t-0 border-b  lg:px-4 p-8">
            <div className="flex justify-start">
                <div className="flex flex-row self-center ml-2">
                    <Image
                        src="/assets/logo.svg"
                        width={80}
                        height={0}
                        style={{filter: filter}}
                        alt="Logo KanPlan"
                        className="ml-3"
                    />
                </div>
            </div>
            <div className="flex justify-end align-end">
                <button onClick={toggleSidebar} className="p-2 top-4 left-4 z-50">
                    {isSidebarOpen ? (
                        <PanelLeftClose className="transition-transform duration-300 transform rotate-180"/>
                    ) : (
                        <PanelLeftOpen className="transition-transform duration-300 transform rotate-0"/>
                    )}
                </button>
                <DropdownHeaderItens/>
            </div>
        </Menubar>
    );
}


function DropdownHeaderItens() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleShareDialogOpen = () => {
        setIsShareDialogOpen(true);
    };

    const handleShareDialogClose = () => {
        setIsShareDialogOpen(false);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><MenuIcon/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleDialogOpen}>
                            <Button variant="ghost">
                                <User className="mr-2 h-4 w-4"/>
                                <span>Perfil</span>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleShareDialogOpen}>
                            <Button variant="ghost">
                                <Share2 className="mr-2 h-4 w-4"/>
                                <span>Código de Convite</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={toggleTheme}>
                            <Button variant="ghost">
                                {theme === 'dark' ? (
                                    <Sun className="mr-2 h-4 w-4"/>
                                ) : (
                                    <Moon className="mr-2 h-4 w-4"/>
                                )}
                                <span>{theme === 'dark' ? 'Claro' : 'Noturno'}</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className={"text-red-500"} onClick={() => signOut()}>
                        <LogOut className=" mr-2 h-4 w-4" />
                        <span>Sair</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {isDialogOpen && <DialogUserItem onClose={handleDialogClose} />}
            {isShareDialogOpen && <DialogShareId onClose={handleShareDialogClose} />}
        </>
    );
}

interface DialogUserItemProps {
    onClose: () => void;
}

export function DialogUserItem({ onClose }: DialogUserItemProps) {
    const { data: sessionData } = useSession();

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Perfil</DialogTitle>
                    <DialogBody>
                        <div className="flex flex-col items-center">
                            <div className="justify-self-center">
                                <Avatar className={"min-h-[80px] min-w-[80px]"}>
                                    <AvatarImage className="rounded-[40px] min-h-2 min-w-2 object-cover"
                                                 src={sessionData?.user?.image ? sessionData?.user?.image : undefined}/>
                                    <AvatarFallback>{sessionData?.user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <h4 className="font-bold text-lg mt-5"> {sessionData?.user?.name}</h4>
                            <h3 className="font-bold">{sessionData?.user?.email}</h3>
                        </div>
                    </DialogBody>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

interface DialogShareIdProps {
    onClose: () => void;
}

export function DialogShareId({ onClose }: DialogShareIdProps) {
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
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="flex-col flex items-center">
                <DialogHeader className="flex-col flex items-center">
                    <DialogTitle>Código de convite</DialogTitle>
                    <DialogDescription className="flex-col flex items-center">
                        Utilize esse código para estabeler conexão com outros usuários.
                        <h1 className="font-bold text-xl">{shareId}</h1>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}