import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { validateNumber } from "@/lib/validator";
import CustomButtom from "@/components/customButton";
import { createClass, getClass } from "@/lib/appwrite";
import { Redirect, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

const ForcedClassScreen = () => {
  const { data, isLoading } = useQuery({
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
  if (!isLoading) {
    if (data) {
      if (data.length > 0) {
        return <Redirect href="/home" />;
      }
    }
  }
  const [form, setForm] = useState({
    class_name: "",
    semester: "",
  });
  const onSubmit = async (data: any) => {
    try {
      const result = await createClass(data.class_name, data.semester);
      if (!result) {
        throw new Error("Error creating class");
      }
      Alert.alert("Success", "Class created successfully");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="mt-[128px]"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="items-center">
            <Text className="font-pextrabold text-3xl">Welcome to Attendy</Text>
            <Text className="font-regular text-base">
              Create a class to get started
            </Text>
          </View>
          <View className="mt-[100px]">
            <View className="mx-4 mt-4">
              <FormField
                value={form.class_name}
                title="Class Name"
                handleChangeText={(e) => setForm({ ...form, class_name: e })}
                otherStyles="mx-3"
                placeholder="Enter class name"
                keyboardType="default"
              />
              <FormField
                value={form.semester}
                title="Semester"
                handleChangeText={(e) =>
                  setForm({ ...form, semester: validateNumber(e, true) })
                }
                otherStyles="mx-3"
                placeholder="Enter the semester (1-12)"
                keyboardType="semester"
              />
            </View>
            <CustomButtom
              title="Create a class"
              handlePress={() => onSubmit(form)}
              textStyles="text-white"
              containerStyles="m-5"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForcedClassScreen;
