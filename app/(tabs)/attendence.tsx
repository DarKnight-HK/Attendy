import { getLectures, getStudents } from "@/lib/appwrite";
import { getCurrentDay } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Text, View, SafeAreaView, Dimensions, ScrollView } from "react-native";

const Attendence = () => {
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
  const {
    data: lectures,
    isLoading: dataLoading,
    refetch,
  } = useQuery({
    initialData: [],
    queryKey: ["lectures"],
    queryFn: async () => {
      try {
        const data = await getLectures(getCurrentDay());
        return data;
      } catch (error) {
        console.log("Error in fetching lectures: ", error);
        return [];
      }
    },
  });
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full h-full items-center mt-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="mt-6">
            <Text className="font-pbold text-2xl">Attendence Report</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendence;
