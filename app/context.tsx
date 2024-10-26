import React, { createContext, useState, useContext } from 'react';

// Define the shape of the context's value
const AppContext = createContext({
    authToken: "",
    setAuthToken: (data) => {},
    refreshToken: "",
    setRefreshToken: (data) => {},
    qrCode: 0,
    setQRCode: (data) => {},
    utilityPic: "",
    setUtilityPic: (data) => {},
    devicePic: "",
    setDevicePic: (data) => {}
});

export const ContextProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [qrCode, setQRCode] = useState(0);
    const [utilityPic, setUtilityPic] = useState("");
    const [devicePic, setDevicePic] = useState("");

    return (
        <AppContext.Provider value={{ authToken, setAuthToken, refreshToken, setRefreshToken, qrCode, setQRCode, utilityPic, setUtilityPic, devicePic, setDevicePic }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);