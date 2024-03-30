import {Loader2} from "lucide-react";
import React from "react";
import {Button} from "~/components/ui/button";

export default function Loading(){
    return (
        <div
            className="  md:w-[82vw] h-full flex flex-col md:justify-center align-middle items-center p-2 md:p-14 ">
            <div className="flex flex-col items-center">
                <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando
                </Button>
            </div>
        </div>
    );
}