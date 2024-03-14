import { Moon, Settings, Sun, User2} from "lucide-react";

import {signOut, useSession} from "next-auth/react";
import {FaSignOutAlt} from "react-icons/fa";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {
    Menubar,
    MenubarContent, MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger
} from "~/components/ui/menubar";


export default function HeaderComponent () {
    const { data: sessionData } = useSession();
    const { theme, setTheme } = useTheme();
    const [filter, setFilter]  = useState('none')

    useEffect(() => {
        theme === 'light' ? setFilter(() => 'invert(95%)') : setFilter(() => '')
    }, [theme, filter])
    return (
        <Menubar className="menu-header rounded-none px-2 border-l-0 border-r-0 border-t-0 border-b  lg:px-4 p-8">
        <div className="flex justify-start">
            <div className="flex flex-row self-center ml-2">
                <h1>IMG</h1>
            </div>
        </div>
        <div className="flex justify-end align-end" >
            <MenubarMenu>
                <MenubarTrigger className="flex flex-row"> <User2/> <span className="font-bold ml-1 mr-2">{ sessionData?.user.name } </span> </MenubarTrigger>
                <MenubarContent className="flex flex-col">
                    <MenubarLabel className="flex flex-row self-center p-4 select-none"> <Settings/> <span className="ml-2">Configurações</span></MenubarLabel>
                    <MenubarSeparator />
                    <MenubarItem className="flex justify-start cursor-pointer" onClick={ () => void signOut()}>
                        <FaSignOutAlt/> <p className="ml-2">Sair</p>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <button className="flex items-center pl-2" onClick={(): void => setTheme(theme === 'dark' ? 'light' : 'dark')} suppressHydrationWarning>
                {theme == "dark" ? <Moon/> : <Sun/>}
            </button>
        </div>
    </Menubar>);
}