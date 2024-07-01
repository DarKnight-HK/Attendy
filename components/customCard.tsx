import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ClockIcon from "./clockIcon";
import { router } from "expo-router";
import { cn, formatTime } from "@/lib/utils";

const CustomCard = ({
  title,
  time,
  teacher,
  isFinished,
  isEditable,
  isHappening,
}: {
  title: string;
  time: string;
  teacher: string;
  isHappening?: boolean;
  isFinished: boolean;
  isEditable?: boolean;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (isEditable) router.push("editScreen/manageClasses");
        else router.push("attendence");
      }}
      className=" flex-row ml-2 mr-2 mb-1 items-center rounded-xl drop-shadow-sm border-2 border-[#eee8e8] max-h-[60px] min-h-[60px] bg-[#FEFEFE] flex-1"
    >
      <ClockIcon isFinished={isFinished} />
      <View className="flex-col ml-2">
        <Text
          className={cn(
            "font-psemibold text-base",
            isFinished ? "text-green-500" : ""
          )}
        >
          {title}
        </Text>
        <Text className="text-xs text-zinc-400 font-pregular">{teacher}</Text>
      </View>
      <View className="ml-auto mr-2">
        <Text
          className={cn(
            "font-psemibold text-base",
            isFinished ? "text-green-500" : ""
          )}
        >
          {formatTime(time)}
        </Text>

        <Text
          className={cn(
            "text-xs font-pregular",
            isFinished ? "text-green-400" : "text-zinc-400"
          )}
        >
          {isFinished ? "Finished ✔️" : isHappening ? "Happening" : "Upcoming"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomCard;
