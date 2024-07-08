import { cn } from "@/lib/utils";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface Props {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  activityIndicatorColor?: string;
  disabled?: boolean;
}

const CustomButtom = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  disabled,
  activityIndicatorColor,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={isLoading || disabled}
      onPress={handlePress}
      activeOpacity={0.7}
      className={cn(
        "bg-black rounded-xl min-h-[40px] flex flex-row justify-center items-center",
        containerStyles
      )}
    >
      <Text className={(cn("text-white font-psemibold text-lg"), textStyles)}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color={activityIndicatorColor || "#ffffff"}
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButtom;
