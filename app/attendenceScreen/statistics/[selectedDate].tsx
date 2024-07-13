import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAttendence, getLectures } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import EmptyState from "@/components/emptyState";
import CustomCard from "@/components/customCard";
import { checkFinished, checkHappening } from "@/lib/utils";

const StatisticsScreen = () => {
  const getDayNumber = (timestring: number) => {
    const date = new Date(timestring);
    return { day: date.getDay(), date: date.toLocaleDateString() };
  };
  const { selectedDate } = useLocalSearchParams();
  const [currentDay, setCurrentDay] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    if (selectedDate && typeof selectedDate === "string") {
      setCurrentDay(getDayNumber(parseInt(selectedDate)).day);
      setCurrentDate(getDayNumber(parseInt(selectedDate)).date);
    }
  }, [selectedDate]);

  const { data: lectures, isLoading: dataLoading } = useQuery({
    initialData: [],
    queryKey: ["lectures", currentDate],
    queryFn: async () => {
      try {
        const data = await getLectures(currentDay);
        if (!data) {
          return [];
        }
        return data;
      } catch (error) {
        console.log("Error in fetching lectures: ", error);
        return [];
      }
    },
  });
  const {
    data: attendence,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    initialData: [],
    queryKey: ["attendence", currentDate],
    queryFn: async () => {
      try {
        const data = await getAttendence(
          currentDate,
          lectures.map((lecture) => lecture.$id)
        );
        if (!data) {
          return [];
        }
        return data;
      } catch (error) {
        console.log("Error in fetching attendence: ", error);
        return [];
      }
    },
  });

  return (
    <SafeAreaView className="h-full">
      <View className="flex mt-[60px] px-4 space-y-6">
        <View className="mb-6">
          {isLoading ||
            (dataLoading && (
              <ActivityIndicator
                animating={isLoading || dataLoading}
                color="#000000"
                size="large"
              />
            ))}
          {(!isLoading || !dataLoading) && (
            <View>
              <Text className="font-pmedium text-sm">The date is</Text>
              <Text className="text-xl font-psemibold">{currentDate}</Text>
              <Text className="text-sm font-pmedium text-zinc-500"></Text>
            </View>
          )}
          <View className="flex items-center mt-3 justify-center">
            <Text className="text-2xl font-pbold">
              Check or modify lectures
            </Text>
            <Text className="font-psemibold text-sm">
              Tap on a lecture for details
            </Text>
          </View>
        </View>
      </View>
      <View className="m-3 flex items-center justify-center flex-row"></View>
      <FlashList
        estimatedItemSize={81}
        removeClippedSubviews={false}
        data={attendence.map((lec) => lec.lecture)}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <CustomCard
            moveto={{
              pathname: "/attendenceScreen/infoScreen/[classID]",
              params: { id: item.$id, currentDate: currentDate },
            }}
            id={item.$id}
            title={item.name}
            time={item.time}
            teacher={item.teacher}
            isFinished={checkFinished(item.time, item.duration, currentDay)}
            isHappening={checkHappening(item.time, item.duration, currentDay)}
            isEditable={false}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            buttonText="Refresh"
            title="Attendence not marked at this date"
            subtitle="Refresh the page if you think this is wrong, swipe down to refresh"
            onPress={refetch}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
};

export default StatisticsScreen;
