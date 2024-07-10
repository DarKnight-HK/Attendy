import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLectures, getFullAttendence } from "@/lib/appwrite";
import { FlashList } from "@shopify/flash-list";
import AttendenceLectureCard from "@/components/attendenceLectureCard";
import EmptyState from "@/components/emptyState";
import { getCurrentDayName } from "@/lib/utils";
import { jsonToCSV } from "react-native-csv";
import CustomButtom from "@/components/customButton";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";

const ReportScreen = () => {
  const [loading, setloading] = useState(false);
  const saveCSVToDownloads = async (csvData: string) => {
    const fileName = "lecture_data.csv";
    const fileUri = FileSystem.documentDirectory + fileName;

    try {
      setloading(true);
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            "text/csv"
          )
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, {
                encoding: FileSystem.EncodingType.Base64,
              });
            })
            .catch((e) => console.log(e));
        } else {
          Sharing.shareAsync(fileUri, {
            mimeType: "text/csv",
            dialogTitle: "Save CSV File",
            UTI: "public.comma-separated-values-text",
          });
        }
      } else {
        Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Save CSV File",
          UTI: "public.comma-separated-values-text",
        });
      }
    } catch (error) {
      console.error("Error saving CSV file:", error);
    } finally {
      setloading(false);
    }
  };

  const {
    data: allLectures,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    initialData: [],
    queryKey: ["allLectures"],
    queryFn: async () => {
      const data = await getAllLectures();
      if (!data) return [];
      return data;
    },
  });
  const { data, refetch: reset } = useQuery({
    initialData: [],
    queryKey: ["selectedLectures"],
    queryFn: async () => {
      return [] as any[];
    },
  });
  const onPress = async (lectureID: any) => {
    try {
      if (!lectureID.length) {
        Alert.alert("Error", "No lectures selected");
        return;
      }
      const data = await getFullAttendence(lectureID);
      if (!data) throw new Error("No data found");
      const transformedData = data.map((item: any) => ({
        Date: item.only_date,
        "Lecture Name": item.lecture.name,
        "Marked at": new Date(item.marked_at).toLocaleTimeString(),
        "Lecture time": new Date(item.lecture.time).toLocaleTimeString(),
        "Absent Students Names": item.absent_students
          .map((std: any) => std.name)
          .join(", "),
        "Absent Students Roll No's": item.absent_students
          .map((std: any) => std.roll_no)
          .join(", "),
      }));
      const csvData = jsonToCSV(transformedData);
      saveCSVToDownloads(csvData);
      reset();
      if (!loading) {
        router.replace("/attendence");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <View style={{ minHeight: Dimensions.get("window").height - 100 }}>
        <FlashList
          estimatedItemSize={81}
          removeClippedSubviews={false}
          data={allLectures}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <AttendenceLectureCard
              onPress={() => {}}
              dayname={getCurrentDayName(item.day)}
              id={item.$id}
              title={item.name}
              time={item.time}
              teacher={item.teacher}
              isEditable={false}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyState
              buttonText="Add Lectures"
              title="No lectures added yet"
              subtitle="Add lectures to mark attendance"
              moveto="editScreen/addClasses"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListHeaderComponent={() => (
            <View className="flex items-center mt-[100] mb-8 justify-center">
              <Text className="text-2xl font-pbold">Your lectures</Text>
              <Text className="font-psemibold text-sm">
                Tap on a lecture to download report in CSV format
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <CustomButtom
              isLoading={loading}
              title="Download data for selected lectures"
              textStyles="text-white"
              containerStyles="mx-3 my-4"
              handlePress={() => onPress(data)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReportScreen;
