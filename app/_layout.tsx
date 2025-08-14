import { Stack } from "expo-router";
import "../global.css"; // <-- REQUIRED
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
