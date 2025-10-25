import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          title: 'Главная',
          headerShown: false,
        }} 
      />
      <Stack.Screen
        name="marker/[id]"
        options={{
          title: 'Детали маркера',
          headerStyle: {
            backgroundColor: "#A23B00"
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 22,
          },
        }}
      />
    </Stack>
  );
}
