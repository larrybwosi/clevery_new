import { Box  } from "native-base";
import { Text } from "../Themed";

interface BadgeProps {
  text: string;
}

export const Badge = ({ text }: BadgeProps) => {
  return (
    <Box
      bg={{
        linearGradient: {
          colors: ["lightBlue.400", "violet.800"],
          start: [0, 0],
          end: [1, 1],
        },
      }}
      p={.5}
      rounded="md"
      className="w-8"
    >
      <Text className="font-rregular text-[10px] ml-2" >
        {text}
      </Text>
    </Box>
  );
};
