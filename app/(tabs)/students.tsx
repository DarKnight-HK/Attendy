import EmptyState from "@/components/emptyState";
import FloatingButton from "@/components/floatingButton";
import SimpleStudentCard from "@/components/simpleStudentcard";
import { getClass, getStudents } from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";

const Students = () => {
  const [search, setSearch] = useState("");
  const {
    data: students,
    isLoading: studentLoader,
    refetch,
    isRefetching,
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
  const { data: classN, isLoading: classLoader } = useQuery({
    initialData: [],
    queryKey: ["CLASS"],
    queryFn: async () => {
      try {
        const data = await getClass();
        if (!data) return [];
        return data;
      } catch (error) {
        console.log("Error in fetching class: ", error);
        return [];
      }
    },
  });

  const handleSearch = (query: any) => {
    setSearch(query);
  };
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, students]);
  return (
    <SafeAreaView className="h-full">
      <FloatingButton destination="editScreen/students/addStudents" />
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
          <View className={cn("space-y-2 bg-white rounded-xl")}>
            <View className="w-full h-16 px-4 rounded-2xl border-2 border-zinc-200 focus:border-zinc-100 flex flex-row items-center">
              <TextInput
                className="flex-1 text-base font-psemibold"
                value={search}
                placeholder={"Enter the name or roll number"}
                placeholderTextColor="#828282"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setSearch}
              />
              <TouchableOpacity onPress={() => {}}>
                <Search color={"black"} />
              </TouchableOpacity>
            </View>
          </View>
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
      <FlashList
        keyboardShouldPersistTaps="always"
        estimatedItemSize={90}
        data={filteredStudents}
        keyExtractor={(item) => item.$id}
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
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
