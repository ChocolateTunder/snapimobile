//These are the tabs settings for the files in the (tabs) folder
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { ContextProvider } from '../context';

export default function TabLayout() {
  return (
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Take a picture of the utility meter',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
            headerTitleAlign: "center"
          }}
        />
        <Tabs.Screen
          name="photo2"
          options={{
            title: 'Take a picture of installed device',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            headerTitleAlign: "center"
          }}
        />
        <Tabs.Screen
          name="calibrate"
          options={{
            title: 'Calibrate Settings',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
            headerTitleAlign: "center"
          }}
        />
      </Tabs>
  );
}