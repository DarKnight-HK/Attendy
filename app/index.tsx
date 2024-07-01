import CustomButtom from "@/components/customButton";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { Redirect, router } from "expo-router";
import { GraduationCap } from "lucide-react-native";
import { Dimensions, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalStore();
  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
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
          <Text className="font-pbold text-xl mb-4">
            Attendence Mangement System by HEX
          </Text>
          <GraduationCap color={"black"} size={128} />

          <CustomButtom
            title="Continue"
            textStyles="text-white"
            containerStyles="w-full mt-7"
            handlePress={() => router.push("/sign-in")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
