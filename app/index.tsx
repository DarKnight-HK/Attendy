import CustomButtom from "@/components/customButton";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getClass } from "@/lib/appwrite";
import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { GraduationCap } from "lucide-react-native";
import { Dimensions, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalStore();
  const { data } = useQuery({
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
  if (!isLoading && isLoggedIn) {
    if (data) {
      if (data.length > 0) {
        return <Redirect href="/home" />;
      }
    } else {
      return <Redirect href="/requiredSteps/forcedClassScreen" />;
    }
  }
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full h-full items-center justify-center px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="font-pbold text-xl mb-4">Attendy</Text>
          <Text className="font-pregualr text-sm mb-4">
            An attendence tracking app for NTU
          </Text>
          <GraduationCap color={"black"} size={128} />

          <CustomButtom
            title="Continue"
            textStyles="text-white"
            containerStyles="w-full mt-7"
            handlePress={() => {
              if (isLoggedIn) router.push("/home");
              else router.push("/sign-in");
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
