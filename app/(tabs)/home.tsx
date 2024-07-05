import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import CustomCard from "@/components/customCard";
import EmptyState from "@/components/emptyState";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import useAppwrite from "@/lib/useAppwrite";
import { getLectures } from "@/lib/appwrite";
import { checkFinished, checkHappening, getCurrentDay } from "@/lib/utils";
import { router } from "expo-router";

const Home = () => {
  const {
    data: lectures,
    refetch,
    loading: dataLoading,
  } = useAppwrite(() => getLectures(getCurrentDay()));

  const { user, isLoading: userLoading } = useGlobalStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
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
            isEditable={false}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-[60px] px-4 space-y-6">
            <View className="mb-6">
              <View className="flex-row justify-between">
                {userLoading && (
                  <ActivityIndicator
                    animating={userLoading}
                    color="#000000"
                    size="large"
                    className="ml-2"
                  />
                )}
                <View>
                  <Text className="font-pmedium text-sm">Welcome Back</Text>
                  {!userLoading && (
                    <Text className="text-2xl font-psemibold">
                      {user?.username}
                    </Text>
                  )}
                </View>
                {!userLoading && (
                  <View>
                    <TouchableOpacity
                      onPress={() => router.push("/profile")}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: user?.avatar }}
                        className="rounded-full size-8"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View className="flex items-center mt-3 justify-center">
                <Text className="text-2xl font-pbold">Your lectures</Text>
                <Text className="font-psemibold text-sm">
                  Tap on a lecture to mark attendece
                </Text>
              </View>
            </View>
            {dataLoading && (
              <ActivityIndicator
                animating={dataLoading}
                color="#000000"
                size="large"
                className="ml-2"
              />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            buttonText="Add Lectures"
            title="No lectures Found"
            subtitle="You have no lectures today."
            moveto="classes"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
