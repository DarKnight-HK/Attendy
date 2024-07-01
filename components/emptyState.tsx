import { View, Text } from "react-native";
import React from "react";
import CustomButton from "./customButton";
import { router } from "expo-router";
import { HeartCrack } from "lucide-react-native";

const EmptyState = ({
  title,
  subtitle,
  buttonText,
  moveto,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  moveto: string;
}) => {
  return (
    <View className="flex mt-[150px] justify-center items-center px-4">
      <HeartCrack color={"black"} fill={"red"} size={48} />

      <Text className="text-sm font-pmedium ">{title}</Text>
      <Text className="text-xl text-center font-psemibold mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title={buttonText}
        handlePress={() => router.push(moveto)}
        containerStyles="w-full my-5"
        textStyles="text-white"
      />
    </View>
  );
};

export default EmptyState;
