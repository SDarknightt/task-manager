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
            <div className="flex flex-col items-center justify-center gap-4">
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
            </div>
        </div>
    );
}