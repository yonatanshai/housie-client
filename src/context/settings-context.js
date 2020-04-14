import React, { useContext } from 'react';

export const SettingsContext = React.createContext();

export function useSettings() {
    return useContext(SettingsContext);
}