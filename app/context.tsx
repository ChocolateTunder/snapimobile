import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context's value
const AppContext = createContext({
    authToken: "",
    setAuthToken: (data) => {},
    refreshToken: "",
    setRefreshToken: (data) => {},
    qrCode: 0,
    setQRCode: (data) => {},
});

export const ContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [qrCode, setQRCode] = useState(0);

    return (
        <AppContext.Provider value={{ authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);