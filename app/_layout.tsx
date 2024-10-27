//This is the overall router for the project, if a login page is to be added it can be added as a Stack.Screen here 
import { Stack } from "expo-router";
import { ContextProvider } from "./context";

export default function RootLayout() {
  return (
  <ContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerTitle: "Scan QR Code to begin", headerBackButtonMenuEnabled: false, headerTitleAlign: "center"}}/>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
  </ContextProvider>
  );
}