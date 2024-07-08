import CustomButtom from "@/components/customButton";
import { getLectures, getStudents } from "@/lib/appwrite";
import { getCurrentDay } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, SafeAreaView, Dimensions, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
const Attendence = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [timeStamp, settimeStamp] = useState(0);
  const [disabled, setDisabled] = useState(true);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full h-full items-center mt-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="mt-6 items-center">
            <Text className="font-pbold text-2xl">Attendence Report</Text>
            <Text className="font-pregular text-base">
              Choose a date to check statistics
            </Text>
          </View>

          <View className="justify-center items-center mt-[50px]">
            <Calendar
              style={{
                borderRadius: 20,
                height: 350,
                width: 300,
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#00adf5",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
              }}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                settimeStamp(day.timestamp);
                setDisabled(false);
                console.log(day);
              }}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "black",
                },
              }}
            />
          </View>
          <View className="w-full">
            <CustomButtom
              disabled={disabled}
              title="Get Report"
              handlePress={() => {
                router.push(`/attendenceScreen/statistics/${timeStamp}`);
              }}
              textStyles="text-white"
              containerStyles="m-6 items-center justify-center flex"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendence;
