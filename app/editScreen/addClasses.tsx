import FormField from "@/components/FormField";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getCurrentDayName } from "@/lib/utils";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import CustomButtom from "@/components/customButton";
import { useState } from "react";
import { validateNumber } from "@/lib/validator";

const AddClasses = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const toggleDatePicker = () => setShowPicker(!showPicker);

  const { currentDay } = useGlobalStore();
  const today = getCurrentDayName(currentDay);
  const formSchema = z.object({
    subject: z
      .string()
      .min(1, {
        message: "Lecture name is required",
      })
      .max(20, { message: "Lecture name should be less than 20 characters" }),
    teacher: z
      .string()
      .min(3, {
        message: "Teacher name can't be less than 3 characters",
      })
      .max(20, { message: "Teacher name can't be more than 20 characters" }),
    creditHours: z
      .string()
      .min(0, {
        message: "Credit hours is required",
      })
      .max(2, { message: "Credit hours should be less than 10" }),
    duration: z
      .string()
      .min(0, { message: "Duration is required" })
      .max(300, { message: "Duration should be less than 300 minutes" }),
    time: z.date(),
    day: z.number().min(0).max(6),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      subject: "",
      teacher: "",
      creditHours: "0",
      duration: "0",
      time: date,
      day: currentDay,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    console.log("entered data", data);
    Alert.alert("Successful", JSON.stringify(data));
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View style={{ minHeight: Dimensions.get("window").height - 100 }}>
          <View className="items-center mt-4">
            <Text className="text-xl font-pbold">
              Adding lectures for {today}
            </Text>
          </View>
          <View className="m-3 gap-y-4">
            <View>
              <Controller
                control={control}
                name={"subject"}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <FormField
                      title="Subject name"
                      placeholder="Enter the name of the lecture"
                      value={value}
                      handleChangeText={onChange}
                      keyboardType="default"
                    />
                    {error && (
                      <Text className="text-xs text-red-500 ml-3 font-pmedium">
                        {error.message}
                      </Text>
                    )}
                    <Text className="text-xs text-gray-400 ml-3 font-pmedium">
                      Eg: Data Structures
                    </Text>
                  </>
                )}
              />
            </View>
            <View>
              <Controller
                control={control}
                name={"teacher"}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <FormField
                      title="Teacher name"
                      placeholder="Enter the name of the teacher"
                      value={value}
                      handleChangeText={onChange}
                      keyboardType="default"
                    />
                    {error && (
                      <Text className="text-xs text-red-500 ml-3 font-pmedium">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
            <View>
              <Controller
                control={control}
                name={"creditHours"}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <FormField
                      title="Credit Hours"
                      placeholder="Enter the credit hours of the subject"
                      value={validateNumber(value)}
                      handleChangeText={onChange}
                      keyboardType="creditHours"
                    />
                    {error && (
                      <Text className="text-xs text-red-500 ml-3 font-pmedium">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
            <View>
              <Controller
                control={control}
                name={"duration"}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <FormField
                      title="Duration"
                      placeholder="Enter the duration in minutes (0-999)"
                      value={validateNumber(value)}
                      handleChangeText={onChange}
                      keyboardType="numeric"
                    />
                    {error && (
                      <Text className="text-xs text-red-500 ml-3 font-pmedium">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
            <View>
              <Controller
                control={control}
                name={"time"}
                defaultValue={date}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    {showPicker && (
                      <DateTimePicker
                        mode="time"
                        value={value || new Date()}
                        display="spinner"
                        onChange={(
                          e: DateTimePickerEvent,
                          selectedDate?: Date
                        ) => {
                          const currentDate = selectedDate;
                          setShowPicker(false);
                          if (currentDate) setDate(currentDate);
                          if (Platform.OS === "android") {
                            toggleDatePicker();
                            onChange(currentDate);
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
                          {value.toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                    {error && (
                      <Text className="text-xs text-red-500 ml-3 font-pmedium">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>
          </View>
          <CustomButtom
            title="Add Students"
            textStyles="text-white"
            containerStyles="m-4"
            handlePress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddClasses;
