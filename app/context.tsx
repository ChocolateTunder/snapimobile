import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context's value
const AppContext = createContext({
    authToken: null,
    setAuthToken: (data) => {},
    refreshToken: null,
    setRefreshToken: (data) => {},
    qrCode: null,
    setQRCode: (data) => {},
});

export const ContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [qrCode, setQRCode] = useState(null);

    return (
        <AppContext.Provider value={{ authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);