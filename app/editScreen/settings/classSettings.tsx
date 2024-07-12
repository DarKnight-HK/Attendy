import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormField from "@/components/FormField";
import { validateNumber } from "@/lib/validator";
import CustomButtom from "@/components/customButton";
import { getClass, updateClass } from "@/lib/appwrite";
import { Redirect, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

const ClassSettings = () => {
  const [submitting, setSubmitting] = useState(false);
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

  const formSchema: { class_name: string; semester: string } = {
    class_name: "",
    semester: "",
  };
  const [form, setForm] = useState(formSchema);
  useEffect(() => {
    if (data.length > 0) {
      setForm({
        class_name: data[0]?.name || "",
        semester: data[0]?.semester.toString() || "",
      });
    }
  }, [data]);
  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      const result = await updateClass(data.class_name, data.semester);
      if (!result) {
        throw new Error("Error updating class");
      }
      Alert.alert("Success", "Class updated successfully");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
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
              Update your class details
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
              title="Update class details"
              handlePress={() => onSubmit(form)}
              textStyles="text-white"
              containerStyles="m-5"
              isLoading={submitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassSettings;
