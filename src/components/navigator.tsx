import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { HomeIcon, SettingsIcon, Gamepad } from "lucide-react";
import { BottomNavigator } from "./BottomNavigater";


const TableHome: React.FC = () => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        console.log(`count is `, count)
    }, [count]);
    return (
        <>
            <h2 className="text-2xl font-bold underline text-center">
                Minimal React template
            </h2>
            <div className="flex items-center justify-center h-screen">
                <div className="bg-lightblue w-52 h-24 text-center">
                    <Button variant="outline" onClick={() => setCount((count) => count + 1)}><Mail /> count is {count}</Button>
                </div>
            </div>
        </>
    )
}

interface CenterAppProps {
    isShow?: boolean
    comp: React.FC
}

const CenterApp: React.FC<CenterAppProps> = ({ isShow, comp: Comp }) => {
    if (isShow === false) return null;
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-lightblue w-52 h-24 text-center">
                <Comp />
            </div>
        </div>
    )
}

const TodoGameComponent: React.FC = () => (
    <div>Todo.. Game Component</div>
);

const TodoSettingsComponent: React.FC = () => (
    <div>Todo.. Settings..</div>
);

const TableGame: React.FC = () => <CenterApp comp={TodoGameComponent} />;
const TableSetting: React.FC = () => <CenterApp comp={TodoSettingsComponent} />;

const tabs = [
    { label: "Home", icon: HomeIcon, component: TableHome },
    { label: "Game", icon: Gamepad, component: TableGame },
    { label: "Settings", icon: SettingsIcon, component: TableSetting },
];


export function NavigatorApp() {
    return (
        <>
            <BottomNavigator tabs={tabs} />
        </>
    )
}