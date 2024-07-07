import { View, Text } from "react-native";
import React from "react";

const AttendenceCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <View className="w-full m-3 mt-2">
      <View className="h-[75px] rounded-xl mx-3 bg-black">
        <View>
          <Text className="text-white font-psemibold text-2xl m-3">
            {title}
          </Text>
        </View>
        <View className="absolute right-0 bottom-0 m-5">
          <Text className="text-white font-psemibold text-2xl">{subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

export default AttendenceCard;
