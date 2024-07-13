import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { deleteStudent, getStudentData, updateStudent } from "@/lib/appwrite";
import FormField from "@/components/FormField";
import { Trash, Upload } from "lucide-react-native";
import CustomButtom from "@/components/customButton";

const ManageStudents = () => {
  const { studentID } = useLocalSearchParams();
  const [changed, setChanged] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { data, loading } = useAppwrite(() => getStudentData(studentID));
  const formSchema: {
    name: string;
    roll_no: string;
    avatar: any;
  } = {
    name: "",
    roll_no: "",
    avatar: "",
  };
  const [form, setForm] = useState(formSchema);

  const deleteSubmit = async () => {
    try {
      setDeleting(true);
      const student = await deleteStudent(studentID);
      if (!student) throw new Error("Error deleting student");
      router.replace("/students");
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    if (data.length > 0) {
      setForm({
        name: data[0]?.name || "",
        roll_no: data[0]?.roll_no || "",
        avatar: data[0]?.avatar || "",
      });
    }
  }, [data]);
  const submit = async () => {
    try {
      setUpdating(true);
      const result = await updateStudent(
        studentID,
        form.name,
        form.roll_no,
        form.avatar
      );
      if (!result) {
        throw new Error("Error updating pfp");
      }
      Alert.alert("Success", "Data updated successfully");
      router.replace("/students");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setUpdating(false);
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
      if (result.assets.length > 0) {
        setForm({ ...form, avatar: result.assets[0] });
        setChanged(true);
      }
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
            {loading && (
              <ActivityIndicator
                animating={loading}
                color="#000000"
                size="large"
              />
            )}
            {!loading && (
              <Text className="font-pextrabold text-2xl">
                Changing data of {data[0]?.name}
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
                placeholder="Enter the student's name"
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
              <TouchableOpacity activeOpacity={0.7} onPress={openPicker}>
                {form.avatar ? (
                  <View className="flex items-center justify-center mt-8">
                    <Image
                      source={
                        changed
                          ? { uri: form.avatar.uri }
                          : { uri: form.avatar }
                      }
                      resizeMode="cover"
                      className="size-64 rounded-2xl  border-2 border-zinc-200 shadow-md"
                    />
                  </View>
                ) : (
                  <View className="flex items-center">
                    <View className="h-16 gap-x-2 w-1/2 px-4 text-red-500 bg-black-100 rounded-2xl border-2 border-zinc-200 m-4 flex justify-center items-center flex-row space-x-2">
                      <Upload color={"black"} size={20} />
                      <Text className="text-sm font-pmedium">
                        Picture (optional)
                      </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <CustomButtom
              title="Change Data"
              handlePress={submit}
              textStyles="text-white"
              isLoading={updating}
              containerStyles="m-5"
            />
            <View className="flex-row items-center justify-center gap-x-3">
              <Trash color={"red"} size={20} />
              <CustomButtom
                title="Delete Student"
                handlePress={deleteSubmit}
                textStyles="text-red-500"
                containerStyles="bg-transparent"
                activityIndicatorColor="#ef4444"
                isLoading={deleting}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageStudents;
