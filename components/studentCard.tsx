import { View, Text, TouchableOpacity, Switch, Image } from "react-native";
import React, { useState } from "react";
import ClockIcon from "./clockIcon";
import { router } from "expo-router";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/hooks/useGlobalStore";

const StudentCard = ({
  id,
  name,
  rollNo,
  imageUrl,
  managing,
}: {
  id: string;
  name: string;
  rollNo: string;
  imageUrl?: string;
  managing: boolean;
}) => {
  const {
    presentStudents,
    setPresentStudents,
    absentStudents,
    setAbsentStudents,
  } = useGlobalStore();
  const [present, setPresent] = useState(presentStudents.includes(id));
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
      <View className={cn("flex-col ml-2", !managing ? "items-center" : "")}>
        <Text className={cn("font-psemibold text-base")}>{name}</Text>
        <Text className={cn("text-xs font-pregular")}>{rollNo}</Text>
      </View>

      {managing && (
        <View className="ml-auto flex-col items-center">
          <Switch
            value={present}
            onValueChange={() => {
              setPresent(!present);
              if (present) {
                setPresentStudents(
                  presentStudents.filter((item) => item !== id)
                );
                setAbsentStudents([...absentStudents, id]);
              } else {
                setAbsentStudents(absentStudents.filter((item) => item !== id));
                setPresentStudents([...presentStudents, id]);
              }
            }}
            trackColor={{ false: "#e3e3e6", true: "#000000" }}
            thumbColor={present ? "#d1dbd5" : "#ffffff"}
          />
          <Text className="text-xs font-pregular mb-2">
            {present ? "Present" : "Absent"}
          </Text>
        </View>
      )}
      {!managing && <View className="w-[60px]" />}
    </TouchableOpacity>
  );
};

export default StudentCard;
