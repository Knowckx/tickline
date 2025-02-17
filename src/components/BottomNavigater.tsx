import React, { useState, FC } from "react";
import { LucideIcon } from "lucide-react"; // For TypeScript Icon Type
import { cn } from "@/lib/utils"; // Assuming you have utils/cn
import { Button } from "@/components/ui/button";

export interface Tab {
    label: string;
    component: React.FC; 
    icon?: LucideIcon; 
}

interface BottomNavigatorProps {
    tabs: Tab[];
}

/* 底部导航栏 */
export const BottomNavigator: FC<BottomNavigatorProps> = ({ tabs }) => {
    // Initialize with the first tab's label or empty string
    const [activeContent, setActiveContent] = useState(tabs[0]?.label || "");

    const handleTabChange = (tabValue: string) => {
        setActiveContent(tabValue);
    };

    // 创建 ComponentMap
    const componentMap: { [key: string]: React.FC } = tabs.reduce(
        (acc: { [key: string]: React.FC }, tab) => {
            acc[tab.label] = tab.component;
            return acc;
        },
        {}
    );

    const ActiveComponent =
        componentMap[activeContent] || (() => <div>Tab Not Found</div>); // 默认组件

    return (
        <div>
            {/* Content area (conditionally render based on activeContent) */}
            <ActiveComponent />
            <OneTabBar tabs={tabs} onTabChange={handleTabChange} />
        </div>
    );
};

interface OneTabBarProps {
    tabs: Tab[];
    onTabChange: (tabValue: string) => void;
}

/** 每一个按钮 */
export const OneTabBar: React.FC<OneTabBarProps> = ({ tabs, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const handleTabClick = (tabValue: string) => {
        setActiveTab(tabValue);
        onTabChange(tabValue); // Optional: Call a parent component to update content
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md p-2 flex justify-around">
            {tabs.map((tab) => (
                <Button
                    key={tab.label}
                    variant="ghost"
                    className={cn(
                        "flex flex-col items-center gap-y-0 w-16 h-12",
                        activeTab === tab.label
                            ? "text-primary" //选中
                            : "text-muted-foreground",  //未选中
                    )}
                    onClick={() => handleTabClick(tab.label)}
                >
                    {tab.icon && <tab.icon className="h-5 w-5 mb-1" />}
                    {tab.label}
                </Button>
            ))}
        </div>
    );
};