import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import StudentCard from "@/components/studentCard";
import EmptyState from "@/components/emptyState";
import {
  checkMarked,
  getStudents,
  markAttendence,
  updateAttendence,
} from "@/lib/appwrite";
import CustomButtom from "@/components/customButton";
import { useMutation, useQuery } from "@tanstack/react-query";

const MarkAttendece = () => {
  const { id, time, title } = useLocalSearchParams();

  const [changing, setChanging] = useState(false);
  const { data: students, isLoading: studentLoader } = useQuery({
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
  const [marked, setMarked] = useState(false);
  const [docID, setDocID] = useState("");

  let allIDs: any[] = [];
  if (!studentLoader && students)
    allIDs = students.map((student) => student.$id);
  let {
    data,
    isLoading,
    refetch: refetchData,
    isRefetching,
  } = useQuery({
    initialData: [{ absent_students: [] }],
    queryKey: ["checkMarked", id, time],
    queryFn: async () => {
      const data = await checkMarked(id, new Date());
      if (data && data?.length > 0) {
        setDocID(data[0].$id);
        setMarked(true);
        const d = [
          {
            absent_students: [
              ...data[0]?.absent_students.map((item: any) => item.$id),
            ],
          },
        ];
        return d;
      }
      setMarked(false);
      return [{ absent_students: [] }];
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const onRefresh = async () => {
    await refetchData();
  };
  const t = time as string;

  const lectureTime = new Date(t).toLocaleTimeString();
  const { mutate, error } = useMutation({
    mutationFn: async () => {
      await updateAttendence(data[0].absent_students, docID);
    },
  });
  const { mutate: markMutation, error: markError } = useMutation({
    mutationFn: async () => {
      await markAttendence(id, data[0].absent_students, new Date());
    },
  });

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      if (marked && !isLoading) {
        mutate();
        if (error) throw new Error("Failed to update attendence");
        Alert.alert("Success", "Attendence updated successfully");
      } else if (!marked && !isLoading) {
        markMutation();
        if (markError) throw new Error("Failed to mark attendence");
        Alert.alert("Success", "Attendence marked successfully");
      }

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (isLoading)
    return (
      <View className="h-full items-center justify-center">
        <ActivityIndicator
          animating={isLoading}
          color="#000000"
          size="large"
          className="ml-2"
        />
      </View>
    );
  return (
    <>
      <View className="absolute w-full  z-10  bottom-0 bg-[#FEFEFE] h-[60px] border-t-2 border-gray-200">
        <View className="size-full p-2 mb-2">
          <CustomButtom
            title={marked ? "Update Attendence" : "Mark Attendence"}
            isLoading={submitting && changing}
            handlePress={onSubmit}
            textStyles="text-white"
            containerStyles="mx-4"
          />
        </View>
      </View>
      <SafeAreaView className="h-full">
        <FlashList
          keyboardShouldPersistTaps="always"
          estimatedItemSize={200}
          data={students}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View className="gap-2">
              <StudentCard
                setChanging={setChanging}
                classID={id}
                time={time}
                id={item.$id}
                managing={true}
                rollNo={item.roll_no}
                name={item.name}
                allIDs={allIDs}
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

                    <View className="gap-x-4">
                      <Text className="text-2xl font-psemibold">{title}</Text>
                      <Text className="text-xs font-zinc-500">
                        {lectureTime}
                      </Text>
                    </View>
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
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <EmptyState
              buttonText="Add Students"
              title="No students found"
              subtitle="Add students to mark attendance."
              moveto="editScreen/students/addStudents"
            />
          )}
          ListFooterComponent={() => <View className="h-[60]" />}
        />
      </SafeAreaView>
    </>
  );
};

export default MarkAttendece;
