import {Github} from "lucide-react";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import { Menubar } from "~/components/ui/menubar";

export default function Footer() {
    const { theme, setTheme } = useTheme();
    const [filter, setFilter]  = useState('none')

    useEffect(() => {
        theme === 'light' ? setFilter(() => 'invert(95%)') : setFilter(() => '')
    }, [theme, filter])
    return (
        <Menubar className=" flex justify-center rounded-none px-2 border border-b p-8 ">
            <div className="flex justify-center">
                <div className="ml-2 flex flex-row justify-center items-center">
                    <a href="https://github.com/SDarknightt" target="_blank" rel="noopener noreferrer" className="flex flex-row">
                        ® 2024 SDarknightt <Github className="ml-2"/>
                    </a>
                </div>
            </div>
        </Menubar>
    );
}