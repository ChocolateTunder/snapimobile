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