import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export default function Background({
  children,
  style
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <LinearGradient
      colors={["#44204f", "#e2c173", "#df826f", "#44204f"]}
      locations={[0, 0.18, 0.9, 1]}
      style={[{ position: "absolute", inset: 0 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
