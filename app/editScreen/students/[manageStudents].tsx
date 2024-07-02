import { View, Text, SafeAreaView, ScrollView, Dimensions } from "react-native";
import React from "react";

const ManageStudents = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageStudents;
