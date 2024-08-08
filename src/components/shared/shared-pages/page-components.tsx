import React from 'react';

interface SectionProps {
    children: React.ReactNode;
}

export function HeaderTemplate({ children }: SectionProps) {
    return <h2 className="text-lg font-bold m-5">{children}</h2>;
}

export function SubContent({ children }: SectionProps) {
    return <div>{children}</div>;
}

export function MainContent({ children }: SectionProps) {
    return (
        <div className="h-full flex mt-3">
            {children}
        </div>
    );
}