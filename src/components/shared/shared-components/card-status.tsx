import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

interface StatusCardProps {
    title: string;
    icon: React.ReactNode;
    value: number;
    color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, icon, value, color }) => {
    return (
        <Card className="sm:min-w-[30%] sm:mx-0 mx-2 h-full">
            <CardHeader className="flex items-center">
                <CardTitle className={"sm:text-2xl text-lg"}>{title}</CardTitle>
                <Separator className={`bg-${color}-500`}/>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <h4 className="sm:text-4xl text-2xl font-bold text-foreground">
                    {icon}{value}
                </h4>
            </CardContent>
        </Card>
    );
};

export default StatusCard;