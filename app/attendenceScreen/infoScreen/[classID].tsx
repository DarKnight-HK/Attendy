import { View, Text, SafeAreaView, ScrollView, Dimensions } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { PieChart } from "react-native-gifted-charts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents } from "@/lib/appwrite";
import { FlashList } from "@shopify/flash-list";
import SimpleStudentCard from "@/components/simpleStudentcard";
import EmptyState from "@/components/emptyState";

const InfoScreen = () => {
  const { currentDate, id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const data: any = queryClient.getQueryData(["attendence", currentDate]);
  const {
    data: students,
    isLoading: studentLoader,
    refetch,
  } = useQuery({
    initialData: [],
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const data = await getStudents();
        return data;
      } catch (error) {
        console.log("Error in fetching students: ", error);
        return [];
      }
    },
  });

  const pieData = [
    {
      value: (students?.length || 14) - data[0]?.absent_students.length,

      color: "rgb(84,219,234)",
    },

    {
      value: data[0]?.absent_students.length,
      color: "orange",
      focus: true,
    },
  ];
  console.log(pieData[0].value, pieData[1].value);

  const renderLegend = (text: string, color: string) => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <View
          style={{
            backgroundColor: color || "white",
          }}
          className="rounded-full mr-[10] h-[18] w-[18]"
        />

        <Text className="text-black">{text || ""}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full">
      <View style={{ minHeight: Dimensions.get("window").height - 100 }}>
        <View className=" justify-center items-center rounded-xl mt-[60]">
          <Text className="text-black font-psemibold text-2xl mb-3">
            Attendence Statistics
          </Text>

          <PieChart
            strokeColor="black"
            strokeWidth={4}
            donut
            data={pieData}
            innerCircleColor="white"
            innerCircleBorderWidth={4}
            innerCircleBorderColor={"black"}
            showValuesAsLabels={true}
            textBackgroundColor="black"
            textColor="white"
            showText
            radius={90}
            textSize={18}
            showTextBackground={true}
            centerLabelComponent={() => {
              return (
                <View className="items-center justify-center">
                  <Text className="text-black text-3xl">
                    {students?.length}
                  </Text>

                  <Text className="text-black text-xl">Total</Text>
                </View>
              );
            }}
          />

          <View className="w-full flex-row justify-evenly mt-4">
            {renderLegend("Present", "rgb(84,219,234)")}

            {renderLegend("Absent", "orange")}
          </View>
        </View>
        <FlashList
          keyboardShouldPersistTaps="always"
          estimatedItemSize={90}
          data={data[0].absent_students}
          keyExtractor={(item: any) => item.$id}
          renderItem={({ item }) => (
            <View className="gap-2">
              <SimpleStudentCard
                id={item.$id}
                rollNo={item.roll_no}
                name={item.name}
                imageUrl={item.avatar}
              />
            </View>
          )}
          ListHeaderComponent={() => (
            <View className="items-center justify-center mt-6">
              <Text className="font-psemibold text-xl text-black">
                Absent Students
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              congrats
              buttonText="Go back"
              title="No absent students found"
              subtitle="Hurray! All students are present"
              moveto="/attendence"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default InfoScreen;
