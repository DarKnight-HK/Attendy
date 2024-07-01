import { AlarmClock, BadgeCheck } from "lucide-react-native";
import { View } from "react-native";

const ClockIcon = ({ isFinished }: { isFinished: boolean }) => {
  return (
    <View className="bg-[#edf0f5] items-center justify-center ml-2 rounded-lg size-[35px]">
      {!isFinished ? (
        <AlarmClock size={12} color={"black"} />
      ) : (
        <BadgeCheck size={12} color={"green"} />
      )}
    </View>
  );
};

export default ClockIcon;
