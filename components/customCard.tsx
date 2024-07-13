import { View, Text, TouchableOpacity } from "react-native";
import ClockIcon from "./clockIcon";
import { router } from "expo-router";
import { cn, formatTime } from "@/lib/utils";

const CustomCard = ({
  id,
  title,
  time,
  teacher,
  isFinished,
  isEditable,
  isHappening,
  moveto,
  dayname,
  onPress,
}: {
  id?: string;
  title: string;
  time: string;
  teacher: string;
  moveto?: any;
  dayname?: string;
  isHappening?: boolean;
  isFinished?: boolean;
  isEditable?: boolean;
  onPress?: any;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (onPress) onPress();
        else if (moveto) router.push(moveto);
        else if (isEditable) router.push(`editScreen/${id}`);
        else
          router.push({
            pathname: "attendenceScreen/[classID]",
            params: { id: id, time: time, title: title },
          });
      }}
      className=" flex-row ml-2 mr-2 mb-1 items-center rounded-xl drop-shadow-sm border-2 border-[#eee8e8] max-h-[60px] min-h-[60px] bg-[#FEFEFE] flex-1"
    >
      <ClockIcon isFinished={isFinished || false} />
      <View className="flex-col ml-2">
        <Text
          className={cn(
            "font-psemibold text-base",
            isFinished ? "text-green-500" : ""
          )}
        >
          {title}
        </Text>
        <Text className="text-xs text-zinc-400 font-pregular">{teacher}</Text>
      </View>
      <View className="ml-auto mr-2">
        <Text
          className={cn(
            "font-psemibold text-base",
            isFinished ? "text-green-500" : ""
          )}
        >
          {formatTime(time)}
        </Text>

        <Text
          className={cn(
            "text-xs font-pregular",
            isFinished ? "text-green-400" : "text-zinc-400"
          )}
        >
          {isFinished
            ? "Finished ✔️"
            : isHappening
            ? "Happening"
            : dayname
            ? dayname
            : "Upcoming"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomCard;
