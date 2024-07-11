import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import CustomButtom from "@/components/customButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { createStudent, getClass } from "@/lib/appwrite";
import { Upload } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";

const AddStudents = () => {
  const {
    data,
    isLoading: loading,
    refetch: classDateRefetch,
  } = useQuery({
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
  const [uploading, setUploading] = useState(false);
  const formSchema: { name: string; roll_no: string; avatar: any } = {
    name: "",
    roll_no: "",
    avatar: null,
  };
  const [form, setForm] = useState(formSchema);

  const onSubmit = async (data: any) => {
    try {
      setUploading(true);
      if (!data.name || data.name.length < 2) {
        Alert.alert("Error", "Name should be greater than 2 characters");
        return;
      } else if (!data.roll_no || data.roll_no.length === 0) {
        Alert.alert("Error", "Roll No is required");
        return;
      }
      const result = await createStudent(data.name, data.roll_no, data.avatar);
      if (result) {
        Alert.alert("Success", "Student added successfully");
        setForm(formSchema);
        router.replace("students");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };
  const openPicker = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      if (result.assets.length > 0)
        setForm({ ...form, avatar: result.assets[0] });
    }
    console.log(form.avatar);
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
            {loading && (
              <ActivityIndicator
                animating={loading}
                color="#000000"
                size="large"
              />
            )}
            {!loading && (
              <Text className="font-pextrabold text-2xl">
                Adding Students for {data[0]?.name}
              </Text>
            )}
          </View>
          <View className="mt-[60px]">
            <View className="mx-4 mt-4">
              <FormField
                value={form.name}
                title="Student Name"
                handleChangeText={(e) => setForm({ ...form, name: e })}
                otherStyles="mx-3"
                placeholder="Enter Student Name"
                keyboardType="default"
              />
              <FormField
                value={form.roll_no}
                title="Roll No"
                handleChangeText={(e) => setForm({ ...form, roll_no: e })}
                otherStyles="mx-3"
                placeholder="2X-NTU-XX-XXXX"
                keyboardType="default"
              />
            </View>
            <View>
              <TouchableOpacity onPress={openPicker} activeOpacity={0.7}>
                {form.avatar ? (
                  <View className="flex items-center justify-center mt-8">
                    <Image
                      source={{ uri: form.avatar.uri }}
                      resizeMode="cover"
                      className="size-64 rounded-2xl  border-2 border-zinc-200 shadow-md"
                    />
                  </View>
                ) : (
                  <View className="flex items-center">
                    <View className="h-16 gap-x-2 w-1/2 px-4 bg-black-100 rounded-2xl border-2 border-zinc-200 m-4 flex justify-center items-center flex-row space-x-2">
                      <Upload color={"black"} size={20} />
                      <Text className="text-sm font-pmedium">
                        Picture (optional)
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View className="w-full">
            <CustomButtom
              title="Add Student"
              handlePress={() => onSubmit(form)}
              textStyles="text-white"
              containerStyles="m-5"
              isLoading={uploading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddStudents;
