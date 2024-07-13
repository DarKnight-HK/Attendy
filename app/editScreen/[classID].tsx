import FormField from "@/components/FormField";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButtom from "@/components/customButton";
import { useEffect, useState } from "react";
import { deleteLecture, editLecture, getSpecificLecture } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { Trash } from "lucide-react-native";

const ManageClasses = () => {
  const { classID } = useLocalSearchParams();
  const { data } = useAppwrite(() => getSpecificLecture(classID));

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const toggleDatePicker = () => setShowPicker(!showPicker);

  const formSchema: {
    name: string;
    teacher: string;
    creditHours: number;
    duration: number;
    time: string;
  } = {
    name: "",
    teacher: "",
    creditHours: 0,
    duration: 0,
    time: date.toISOString(),
  };
  const [form, setForm] = useState(formSchema);
  useEffect(() => {
    if (data.length > 0) {
      setForm({
        name: data[0]?.name || "",
        teacher: data[0]?.teacher || "",
        creditHours: data[0]?.credit_hours || "0",
        duration: data[0]?.duration || "0",
        time: data[0]?.time || "",
      });
    }
  }, [data]);
  const onSubmit = async () => {
    try {
      setUpdating(true);
      if (
        !form.name ||
        !form.teacher ||
        !form.creditHours ||
        !form.duration ||
        !form.time
      ) {
        throw new Error("Please fill all the fields");
      }
      const result = await editLecture(
        classID,
        form.name,
        form.teacher,
        form.creditHours,
        form.duration,
        form.time
      );
      if (!result) {
        throw new Error("Error updating lecture");
      }
      Alert.alert("Success", "Lecture updated successfully");
      router.replace("/classes");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.log(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const onDelete = async () => {
    try {
      setDeleting(true);
      const result = await deleteLecture(classID);
      if (!result) {
        throw new Error("Error deleting lecture");
      }
      Alert.alert("Success", "Lecture deleted successfully");
      router.replace("/classes");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.log(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View style={{ minHeight: Dimensions.get("window").height - 100 }}>
          <View className="items-center mt-8">
            <Text className="text-xl font-pbold">
              Updating: {form.name || "Lecture"}
            </Text>
          </View>
          <View className="m-3 gap-y-4 mt-[100px]">
            <View>
              <FormField
                title="Subject name"
                placeholder="Enter the name of the lecture"
                value={form.name}
                handleChangeText={(e) => setForm({ ...form, name: e })}
                keyboardType="default"
              />
              <Text className="text-xs text-gray-400 ml-3 font-pmedium">
                Eg: Data Structures
              </Text>
            </View>
            <View>
              <FormField
                title="Teacher name"
                placeholder="Enter the name of the teacher"
                value={form.teacher}
                handleChangeText={(e) => setForm({ ...form, teacher: e })}
                keyboardType="default"
              />
            </View>
            <FormField
              title="Credit Hours"
              placeholder="Enter the credit hours of the subject"
              value={form.creditHours.toString()}
              handleChangeText={(e) => setForm({ ...form, creditHours: e })}
              keyboardType="creditHours"
            />
            <View>
              <FormField
                title="Duration"
                placeholder="Enter the duration in minutes (0-999)"
                value={form.duration.toString()}
                handleChangeText={(e) => setForm({ ...form, duration: e })}
                keyboardType="numeric"
              />
            </View>
            <View>
              {showPicker && (
                <DateTimePicker
                  mode="time"
                  value={new Date(form.time)}
                  display="spinner"
                  onChange={(e: DateTimePickerEvent, selectedDate?: Date) => {
                    const currentDate = selectedDate;
                    setShowPicker(false);
                    if (currentDate) setDate(currentDate);
                    if (Platform.OS === "android") {
                      toggleDatePicker();
                      if (selectedDate)
                        setForm({ ...form, time: selectedDate?.toISOString() });
                    } else {
                      setDate(date);
                    }
                  }}
                  is24Hour={false}
                />
              )}
              <View className="flex-row mt-3 items-center flex-1 justify-between">
                <CustomButtom
                  title="Set Time"
                  textStyles="text-white"
                  containerStyles="w-[50%]"
                  handlePress={toggleDatePicker}
                />
                <View className="mr-8 border-2 border-zinc-200 w-24 h-10 flex items-center justify-center rounded-xl">
                  <Text className="text-zinc-600 font-pmedium">
                    {new Date(form.time).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              <CustomButtom
                title="Update Lecture"
                textStyles="text-white"
                isLoading={updating}
                containerStyles="mx-4 mt-5"
                handlePress={onSubmit}
              />
              <View className="flex-row items-center mt-4 justify-center gap-x-3">
                <Trash color={"red"} size={20} />

                <CustomButtom
                  title="Delete Lecture"
                  handlePress={onDelete}
                  textStyles="text-red-500"
                  containerStyles="bg-transparent"
                  activityIndicatorColor="#ef4444"
                  isLoading={deleting}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageClasses;
