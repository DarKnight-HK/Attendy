import EmptyState from "@/components/emptyState";
import FloatingButton from "@/components/floatingButton";
import SearchBox from "@/components/searchBox";
import StudentCard from "@/components/studentCard";
import { getClass, getStudents } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

const Students = () => {
  const {
    data: students,
    refetch,
    loading: studentLoader,
  } = useAppwrite(getStudents);
  const { data: classN, loading: classLoader } = useAppwrite(getClass);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [search, setSearch] = useState("");
  useEffect(() => {}, [search]);
  return (
    <SafeAreaView className="h-full">
      <FloatingButton destination="editScreen/students/addStudents" />

      <FlashList
        keyboardShouldPersistTaps="always"
        estimatedItemSize={90}
        data={students}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <View className="gap-2">
            <StudentCard
              managing={false}
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
                  <Text className="font-pmedium text-sm">Your class is</Text>
                  {classLoader && (
                    <ActivityIndicator
                      animating={classLoader}
                      color="#000000"
                      size="small"
                      className="ml-2"
                    />
                  )}
                  {!classLoader && (
                    <Text className="text-2xl font-psemibold">
                      {classN[0]?.name}
                    </Text>
                  )}
                </View>
                <View className="flex items-center mt-3 justify-center">
                  <Text className="text-2xl font-pbold">Students</Text>
                  <Text className="font-psemibold text-sm">
                    Tap on a student to modify
                  </Text>
                </View>
              </View>
            </View>
            <View className="my-3 mx-4">
              <SearchBox
                placeholder="Enter the student name or roll number"
                otherStyles="bg-white rounded-xl"
              />
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

export default Students;
