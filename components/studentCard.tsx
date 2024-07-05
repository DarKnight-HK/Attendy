import { View, Text, TouchableOpacity, Switch, Image } from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkMarked } from "@/lib/appwrite";

const StudentCard = ({
  id,
  name,
  rollNo,
  imageUrl,
  managing,
  classID,
  time,
  setChanging,
}: {
  id: string;
  name: string;
  rollNo: string;
  imageUrl?: string;
  managing: boolean;
  allIDs: any[];
  classID?: any;
  time?: any;
  setChanging?: any;
}) => {
  const queryClient = useQueryClient();
  let { data, isLoading } = useQuery({
    initialData: [{ absent_students: [] }],
    queryKey: ["checkMarked", classID, time],
    queryFn: async () => {
      const data = await checkMarked(classID, new Date());
      if (data && data?.length > 0) {
        const d = [
          {
            absent_students: [
              ...data[0]?.absent_students.map((item: any) => item.$id),
            ],
          },
        ];
        return d;
      }
      return [{ absent_students: [] }];
    },
  });
  const [present, setPresent] = useState(
    data[0]?.absent_students.includes(id) ? false : true
  );
  const { mutate } = useMutation({
    mutationFn: async () => {
      setPresent((prevPresent) => !prevPresent);
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["checkMarked", classID, time],
        (oldData?: any[]) => {
          if (oldData && oldData.length > 0) {
            let newData = [...oldData];
            let absentStudents = newData[0]?.absent_students || [];

            if (absentStudents.includes(id)) {
              absentStudents = absentStudents.filter(
                (studentId: any) => studentId !== id
              );
            } else {
              absentStudents = [...absentStudents, id];
            }

            newData[0] = {
              ...newData[0],
              absent_students: absentStudents,
            };
            console.log(newData[0].absent_students);
            return newData;
          } else {
            return [{ absent_students: [] }];
          }
        }
      );
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {}}
      className={cn(
        "flex-row mr-[8px] ml-[8px] my-[2px] items-center rounded-xl  border-2 border-[#eee8e8] max-h-[60px] min-h-[60px] bg-[#FEFEFE] flex-1 justify-between"
      )}
    >
      <View className="size-[48px] ml-3 border border-gray-300 rounded-full flex justify-center items-center">
        <Image
          source={{ uri: imageUrl }}
          className="rounded-full w-[90%] h-[90%]"
          resizeMode="cover"
        />
      </View>
      <View className={cn("flex-col ml-2", !managing ? "items-center" : "")}>
        <Text className={cn("font-psemibold text-base")}>{name}</Text>
        <Text className={cn("text-xs font-pregular")}>{rollNo}</Text>
      </View>

      {managing && (
        <View className="ml-auto flex-col items-center">
          <Switch
            disabled={isLoading}
            value={present}
            onValueChange={() => {
              mutate();
            }}
            trackColor={{ false: "#e3e3e6", true: "#000000" }}
            thumbColor={present ? "#d1dbd5" : "#ffffff"}
          />
          <Text className="text-xs font-pregular mb-2">
            {present ? "Present" : "Absent"}
          </Text>
        </View>
      )}
      {!managing && <View className="w-[60px]" />}
    </TouchableOpacity>
  );
};

export default StudentCard;
