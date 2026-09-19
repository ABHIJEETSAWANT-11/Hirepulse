import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

const STORAGE_KEY = "hirepulse_user";

export function UserProvider({ children }) {
    const [user, setUserState] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const setUser = (userData) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const clearUser = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
