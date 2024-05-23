import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: 'home/home',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"options={{
        headerShown: false
      }}/>

      <Stack.Screen name="(login)/login" options={{
        headerTitle: "SNAPI Installer Login"
      }}/>

      <Stack.Screen name="(home)/home" options={{
        headerShown: false
      }}/>
    </Stack>
  );
}