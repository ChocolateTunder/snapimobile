import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context's value
const AuthContext = createContext({
    authTokens: null,
    setTokens: (data) => {}
});

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(null);

    const setTokens = (data) => {
        setAuthTokens(data);
    };

    return (
        <AuthContext.Provider value={{ authTokens, setTokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);