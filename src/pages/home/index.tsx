import {signIn, signOut, useSession} from "next-auth/react";
import {api} from "~/utils/api";
import * as React from "react"
import {Button} from "~/components/ui/button";

export default function Home() {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.post.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );
    return (
    <div>
        <h2 className="text-lg font-bold m-5 ">Home</h2>
        <div className="md:w-[82vw] h-full flex flex-col justify-start md:justify-center align-middle items-center p-2 md:p-14 ">
            <div className="w-screen md:w-full -ml-5 md:ml-0 flex justify-around select-none">

            </div>
            <div className="w-screen md:w-full md:overflow-hidden -ml-5">
                <div>
                    <div className="flex flex-col items-center justify-center gap-4 bg-blue-300 h-screen">
                        <p className="text-center text-2xl text-black">
                            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                            {secretMessage && <span> - {secretMessage}</span>}
                        </p>
                        <Button
                            className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-red-700"
                            onClick={sessionData ? () => void signOut() : () => void signIn()}
                        >
                            {sessionData ? "Sign out" : "Sign in"}
                        </Button>


                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}