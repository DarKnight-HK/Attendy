import { View, Text } from "react-native";
import React from "react";
import CustomButton from "./customButton";
import { router } from "expo-router";
import { HeartCrack, PartyPopper } from "lucide-react-native";
import { cn } from "@/lib/utils";

const EmptyState = ({
  title,
  subtitle,
  buttonText,
  moveto,
  congrats,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  moveto: string;
  congrats?: boolean;
}) => {
  return (
    <View
      className={cn(
        "flex justify-center items-center px-4",
        !congrats ? "mt-[150px]" : "mt-[30px]"
      )}
    >
      {!congrats && <HeartCrack color={"black"} fill={"red"} size={48} />}
      {congrats && <PartyPopper color={"black"} fill={"red"} size={48} />}

      <Text className="text-sm font-pmedium ">{title}</Text>
      <Text className="text-xl text-center font-psemibold mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title={buttonText}
        handlePress={() => router.push(moveto)}
        containerStyles="w-full my-5"
        textStyles="text-white"
      />
    </View>
  );
};

export default EmptyState;
