import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ClockIcon from "./clockIcon";
import { cn, formatTime } from "@/lib/utils";
import Checkbox from "expo-checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const AttendenceLectureCard = ({
  id,
  title,
  time,
  teacher,
  isFinished,
  dayname,
  onPress,
}: {
  id?: string;
  title: string;
  time: string;
  teacher: string;
  moveto?: any;
  dayname?: string;
  isHappening?: boolean;
  isFinished?: boolean;
  isEditable?: boolean;
  onPress?: any;
}) => {
  const queryClient = useQueryClient();
  const [isChecked, setChecked] = useState(false);
  const [changing, setChanging] = useState(false);
  const { mutate } = useMutation({
    mutationFn: async () => {
      setChecked((prevState) => !prevState);
      setChanging(true);
    },
    onSuccess: () => {
      queryClient.setQueryData(["selectedLectures"], (oldData: any) => {
        if (oldData) {
          let newData = [...oldData];
          if (isChecked && !newData.includes(id)) {
            newData.push(id);
          }
          if (!isChecked && newData.includes(id)) {
            newData = newData.filter((item: any) => item !== id);
          }
          setChanging(false);

          return newData;
        } else return [];
      });
    },
  });
  return (
    <View className="flex-row items-center ml-4">
      <Checkbox
        disabled={changing}
        value={isChecked}
        onValueChange={() => {
          mutate();
        }}
        color={isChecked ? "#000000" : undefined}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (onPress) onPress();
        }}
        className=" flex-row ml-2 mr-2 mb-1 items-center rounded-xl drop-shadow-sm border-2 border-[#eee8e8] max-h-[60px] min-h-[60px] bg-[#FEFEFE] flex-1"
      >
        <ClockIcon isFinished={isFinished || false} />
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
            {dayname}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AttendenceLectureCard;
