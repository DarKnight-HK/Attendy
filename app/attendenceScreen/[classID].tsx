import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import StudentCard from "@/components/studentCard";
import EmptyState from "@/components/emptyState";
import useAppwrite from "@/lib/useAppwrite";
import {
  checkMarked,
  getSpecificLecture,
  getStudents,
  markAttendence,
  updateAttendence,
} from "@/lib/appwrite";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import CustomButtom from "@/components/customButton";
import { useQuery } from "@tanstack/react-query";

const MarkAttendece = () => {
  const { classID } = useLocalSearchParams();
  const {
    data: students,
    refetch,
    loading: studentLoader,
  } = useAppwrite(getStudents);
  const { data: classN, loading: classLoader } = useAppwrite(() =>
    getSpecificLecture(classID)
  );
  // const { data: attendy, loading } = useAppwrite(() =>
  //   checkMarked(classID, new Date())
  // );
  const { data, isLoading } = useQuery({
    queryKey: ["checkMarked", classID],
    queryFn: async () => {
      const data = await checkMarked(classID, new Date());
      return data;
    },
  });
  console.log(data);
  const allIDs = students.map((student) => student.$id);
  const {
    presentStudents,
    setAbsentStudents,
    absentStudents,
    setPresentStudents,
  } = useGlobalStore();
  // if (loading === false) {
  //   setPresentStudents(
  //     attendy[0]?.present_students.map((item: any) => item.$id)
  //   );
  //   setAbsentStudents(attendy[0]?.absent_students.map((item: any) => item.$id));
  //   console.log("Present: ", presentStudents);
  // }
  // if (attendy.length > 0) {
  //   const p = attendy[0]?.present_students.map((item: any) => item.$id);
  //   const a = attendy[0]?.absent_students.map((item: any) => item.$id);
  //   setAbsentStudents(a);
  //   setPresentStudents(p);
  // } else
  // setPresentStudents(allIDs);

  let marked = false;
  // if (attendy && attendy?.length > 0) {
  //   marked = true;
  // }
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const lectureTime = new Date(classN[0]?.time).toLocaleTimeString();
  // const onSubmit = async () => {
  //   try {
  //     setSubmitting(true);
  //     if (!marked) {
  //       const attendence = await markAttendence(
  //         classID,
  //         presentStudents,
  //         absentStudents,
  //         new Date()
  //       );
  //       if (attendence) {
  //         Alert.alert("Success", "Attendence marked successfully");
  //       }
  //       router.replace("/home");
  //     } else {
  //       const attendence = await updateAttendence(
  //         presentStudents,
  //         absentStudents,
  //         attendy[0].$id
  //       );
  //       if (attendence) {
  //         Alert.alert("Success", "Attendence marked successfully");
  //       }
  //       router.replace("/home");
  //     }
  //   } catch (error: any) {
  //     Alert.alert("Error", error.message);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  return (
    <SafeAreaView className="h-full">
      <View className="absolute w-full  z-10  bottom-0 bg-[#FEFEFE] h-[60px] border-t-2 border-gray-200">
        <View className="size-full p-2 mb-2">
          <CustomButtom
            title={marked ? "Update Attendence" : "Mark Attendence"}
            isLoading={submitting}
            handlePress={() => {}}
            textStyles="text-white"
            containerStyles="mx-4"
          />
        </View>
      </View>
      <FlashList
        keyboardShouldPersistTaps="always"
        estimatedItemSize={90}
        data={students}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="gap-2">
            <StudentCard
              id={item.$id}
              managing={true}
              rollNo={item.roll_no}
              name={item.name}
              imageUrl={item.avatar}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex mt-[60px] px-4 space-y-6">
              <View className="mb-6">
                <View>
                  <Text className="font-pmedium text-sm">
                    {marked ? `Updating` : `Marking`} attendence for
                  </Text>
                  {classLoader && (
                    <ActivityIndicator
                      animating={classLoader}
                      color="#000000"
                      size="small"
                      className="ml-2"
                    />
                  )}
                  {!classLoader && (
                    <View className="gap-x-4">
                      <Text className="text-2xl font-psemibold">
                        {classN[0]?.name}
                      </Text>
                      <Text className="text-xs font-zinc-500">
                        {lectureTime}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex items-center mt-3 justify-center">
                  <Text className="text-2xl font-pbold">
                    {marked ? `Updating` : `Students`}
                  </Text>
                  <Text className="font-psemibold text-sm">
                    {marked ? `Update` : `Mark`} attendence by clicking on the
                    switch
                  </Text>
                </View>
              </View>
            </View>
            <View className="my-3 mx-4">
              {studentLoader && (
                <ActivityIndicator
                  animating={studentLoader}
                  color="#000000"
                  size="large"
                  className="ml-2"
                />
              )}
            </View>
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <EmptyState
            buttonText="Add Students"
            title="No students found"
            subtitle="Add students to mark attendance."
            moveto="editScreen/students/addStudents"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MarkAttendece;
