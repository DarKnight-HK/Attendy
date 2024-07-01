import { View, Text, FlatList } from "react-native";
import React from "react";
import CustomCard from "./customCard";

const ClassList = ({ data }: any) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <CustomCard
          title={item.title}
          teacher={item.teacher}
          time={item.time}
          isFinished={item.isFinished}
        />
      )}
    />
  );
};
export default ClassList;
