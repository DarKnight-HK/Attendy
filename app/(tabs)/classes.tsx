import CustomCard from "@/components/customCard";
import DaysList from "@/components/daysList";
import EmptyState from "@/components/emptyState";
import FloatingButton from "@/components/floatingButton";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getClass, getLectures } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { checkFinished, checkHappening } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

const Classes = () => {
  const { currentDay } = useGlobalStore();
  const { data: lectures, refetch } = useAppwrite(() =>
    getLectures(currentDay)
  );
  const {
    data: classN,
    refetch: classDateRefetch,
    loading,
  } = useAppwrite(getClass);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    refetch();
  }, [currentDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <FloatingButton destination="editScreen/addClasses" />
      <View className="flex mt-[60px] px-4 space-y-6">
        <View className="mb-6">
          {loading && (
            <ActivityIndicator
              animating={loading}
              color="#000000"
              size="large"
            />
          )}
          {!loading && (
            <View>
              <Text className="font-pmedium text-sm">Your class is</Text>
              <Text className="text-2xl font-psemibold">{classN[0]?.name}</Text>
              <Text className="text-sm font-pmedium text-zinc-500">
                {`${classN[0]?.semester}rd Semester`}
              </Text>
            </View>
          )}
          <View className="flex items-center mt-3 justify-center">
            <Text className="text-2xl font-pbold">Modify Lectures</Text>
            <Text className="font-psemibold text-sm">
              Tap on a lecture to modify
            </Text>
          </View>
        </View>
      </View>
      <View className="m-3 flex items-center justify-center flex-row">
        <DaysList />
      </View>
      <FlashList
        estimatedItemSize={81}
        removeClippedSubviews={false}
        data={lectures}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <CustomCard
            id={item.$id}
            title={item.name}
            time={item.time}
            teacher={item.teacher}
            isFinished={checkFinished(item.time, item.duration)}
            isHappening={checkHappening(item.time, item.duration)}
            isEditable={true}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            buttonText="Add Lectures"
            title="No lectures added yet"
            subtitle="Add lectures to mark attendance"
            moveto="editScreen/addClasses"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Classes;
