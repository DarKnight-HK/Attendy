import { View, Text, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { useEffect, useState } from "react";

const DaysList = () => {
  const { currentDay, setCurrentDay } = useGlobalStore();
  const data = [
    { id: 0, day: "SUNDAY" },
    { id: 1, day: "MONDAY" },
    { id: 2, day: "TUESDAY" },
    { id: 3, day: "WEDNESDAY" },
    { id: 4, day: "THURSDAY" },
    { id: 5, day: "FRIDAY" },
    { id: 6, day: "SATURDAY" },
  ];

  return (
    <FlashList
      estimatedItemSize={10}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setCurrentDay(item.id);
          }}
          className={cn(
            "bg-black flex items-center justify-center mr-3 size-[32px] rounded-lg",
            item.id === currentDay ? "border-2 border-gray-300" : ""
          )}
          activeOpacity={0.7}
        >
          <Text
            className={cn(
              item.id === currentDay ? "text-zinc-300" : "text-white"
            )}
          >
            {item.day[0]}
          </Text>
        </TouchableOpacity>
      )}
      horizontal
    />
  );
};

export default DaysList;
