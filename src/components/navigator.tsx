import React from "react";
import { HomeIcon, SettingsIcon, Gamepad } from "lucide-react";
import { BottomNavigator } from "./BottomNavigater";
import TickLineApp from "./TickLineApp";


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
    { label: "Home", icon: HomeIcon, component: TickLineApp },
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