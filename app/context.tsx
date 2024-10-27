//This is the appwide context, check the app/_layout.tsx to see how it's used. These values can be passed to any pages the context envelops in the router.
import React, { createContext, useState, useContext } from 'react';


//If more contexts are to be added add the value and setter here, and also in the ContextProvider below
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