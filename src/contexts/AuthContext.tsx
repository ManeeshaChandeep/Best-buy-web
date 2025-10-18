'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuthStatus = () => {
            const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
            setIsAuthenticated(loggedIn);
            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('admin_logged_in', 'true');
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin_user_name');
        localStorage.removeItem('admin_user_email');
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
