import { View, Text, SafeAreaView, ScrollView, Dimensions } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const InfoScreen = () => {
  const { classID } = useLocalSearchParams();

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          style={{ minHeight: Dimensions.get("window").height - 100 }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InfoScreen;
