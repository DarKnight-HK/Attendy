import { View, Text, TouchableOpacity, Switch, Image } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { cn } from "@/lib/utils";

const SimpleStudentCard = ({
  id,
  name,
  rollNo,
  imageUrl,
}: {
  id: string;
  name: string;
  rollNo: string;
  imageUrl?: string;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        router.push(`/editScreen/students/${id}`);
      }}
      className={cn(
        "flex-row mr-[8px] ml-[8px] my-[2px] items-center rounded-xl  border-2 border-[#eee8e8] max-h-[60px] min-h-[60px] bg-[#FEFEFE] flex-1 justify-between"
      )}
    >
      <View className="size-[48px] ml-3 border border-gray-300 rounded-full flex justify-center items-center">
        <Image
          source={{ uri: imageUrl }}
          className="rounded-full w-[90%] h-[90%]"
          resizeMode="cover"
        />
      </View>
      <View className={cn("flex-col ml-2 items-center")}>
        <Text className={cn("font-psemibold text-base")}>{name}</Text>
        <Text className={cn("text-xs font-pregular")}>{rollNo}</Text>
      </View>
      <View className="w-[60px]" />
    </TouchableOpacity>
  );
};

export default SimpleStudentCard;
