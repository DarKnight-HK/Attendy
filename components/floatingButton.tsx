import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";

const FloatingButton = ({ destination }: { destination: string }) => {
  return (
    <View className="absolute z-10 right-[20] bottom-[30] flex-1">
      <TouchableOpacity
        className=" rounded-full flex items-center justify-center size-16 shadow-md bg-black"
        activeOpacity={0.7}
        onPress={() => {
          router.push(destination);
        }}
      >
        <Plus color={"white"} />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;
