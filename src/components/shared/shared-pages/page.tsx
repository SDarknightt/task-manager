import React from 'react';

interface PageProps {
    children: React.ReactNode;
}

function Page({ children }: PageProps) {
    return (
        <div className="flex flex-col">
            {children}
        </div>
    );
}

export default Page;