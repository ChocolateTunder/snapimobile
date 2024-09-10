import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E90FF', // Use a vibrant blue for active tabs
        tabBarInactiveTintColor: '#95a5a6', // Softer gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#1A1A2E', // Dark background for a sleek look
          borderTopColor: 'transparent', // Remove top border for a cleaner look
          paddingBottom: 5, // More padding for spacing
          paddingTop: 5, // More padding for a cleaner layout
          height: 60, // Taller tab bar for better usability
        },
        tabBarLabelStyle: {
          fontSize: 12, // Font size for readability
          fontWeight: '600', // Bold the label for emphasis
        },
        headerStyle: {
          backgroundColor: '#1A1A2E', // Dark header background for consistency
          elevation: 0, // No shadow on the header
        },
        headerTitleStyle: {
          fontSize: 18, // Larger title font for better visibility
          fontWeight: 'bold', // Bold header title for a strong appearance
          color: '#ecf0f1', // Light color for contrast against dark background
        },
        headerTitleAlign: 'center', // Center the title for a balanced layout
        tabBarIconStyle: {
          marginBottom: 3, // Add space between the icon and the label
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Take a Picture of the Utility Meter',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calibrate"
        options={{
          title: 'Calibrate Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="photo2"
        options={{
          title: 'Take a Picture of Installed Device',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
        }}
      />
    </Tabs>
  );
}
