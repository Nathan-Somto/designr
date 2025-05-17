'use client';

import { createContext, useContext, useState } from 'react';
import { UserSettings } from '@designr/db/user-settings';

type SettingsContextType = {
    settings: UserSettings | null;
    updateSettings: (newSettings: UserSettings) => void;
};

const UserSettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children, initialSettings }: {
    children: React.ReactNode;
    initialSettings: UserSettings;
}) => {
    const [settings, setSettings] = useState<UserSettings | null>(initialSettings);

    const updateSettings = (newSettings: UserSettings) => {
        setSettings(newSettings);
    };

    return (
        <UserSettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </UserSettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(UserSettingsContext);
    if (!context) throw new Error('useUserSettings must be used within a UserSettingsProvider');
    return context;
};
