import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ServerLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="server/[id]" options={{ presentation: 'modal', headerShown: false  }} />
        <Stack.Screen name="channel/[id]" options={{ presentation: 'card', headerShown: false  }} />
        <Stack.Screen name="create-channel/[serverid]" options={{ presentation: 'card', headerShown: false  }} />
        <Stack.Screen name="create-server" options={{ headerShown: false }} />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default ServerLayout;
