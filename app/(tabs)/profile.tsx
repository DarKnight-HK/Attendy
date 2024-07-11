import {
  View,
  Image,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  Camera,
  ClipboardPen,
  LogOut,
  Settings,
  User,
} from "lucide-react-native";
import CustomButtom from "@/components/customButton";
import { router } from "expo-router";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { changePfp, getCurrentUser, signOut } from "@/lib/appwrite";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const formSchema: { avatar: any } = { avatar: null };
  const [pfp, setPfp] = useState(formSchema);
  const { user, setIsLoggedIn, setUser } = useGlobalStore();
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const logout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      setUser(null);
      setIsLoggedIn(false);
      queryClient.setQueryData(["user"], null);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoggingOut(false);
    }
  };
  const { data: profilePic, isLoading: userLoading } = useQuery({
    initialData: null,
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return null;
        return user;
      } catch (error) {
        console.log("Error in fetching user: ", error);
        return null;
      }
    },
  });
  useEffect(() => {}, [user]);
  const onSub = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      if (result.assets.length > 0)
        setPfp({ ...pfp, avatar: result.assets[0] });
    }
    if (pfp.avatar) {
      try {
        setLoading(true);
        const result = await changePfp(pfp.avatar);
        if (!result) {
          throw new Error("Error updating pfp");
        }
        const newUser = await getCurrentUser();
        setUser(newUser);
        setPfp(formSchema);
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <SafeAreaView>
      <View
        className="w-full h-full px-4 my-6"
        style={{
          minHeight: Dimensions.get("window").height - 100,
        }}
      >
        <View className="flex items-center my-3 justify-center">
          {loading && (
            <ActivityIndicator
              animating={loading}
              color="#000000"
              size="large"
              className="ml-2"
            />
          )}
          {!loading && (
            <TouchableOpacity
              activeOpacity={0.9}
              className="size-[84px] my-8 ml-3  rounded-full flex justify-center items-center"
              onPress={onSub}
              disabled={loading}
            >
              <Image
                source={{ uri: profilePic?.avatar }}
                className="rounded-full w-[90%] h-[90%]"
                resizeMode="cover"
              />
              <View className="absolute right-[-7] bottom-[-4] size-9 rounded-lg border flex items-center justify-center border-white bg-black">
                <Camera color={"white"} />
              </View>
            </TouchableOpacity>
          )}
          <View className="flex items-center justify-center gap-y-2">
            <Text className="font-pbold text-2xl">{profilePic?.username}</Text>
            <Text className="text-base text-black font-pregular">
              {profilePic?.bio === '""' ? "" : profilePic?.bio}
            </Text>
          </View>
        </View>
        <View>
          <CustomButtom
            title="Edit Profile"
            containerStyles="w-full"
            textStyles="text-white"
            handlePress={() => router.push("/editScreen/settings/editProfile")}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push("/editScreen/settings/classSettings");
          }}
          className="flex-row items-center border-b-2 min-h-[60px] my-7 border-gray-200"
        >
          <View className="size-10 flex items-center justify-center ml-3 rounded-full bg-gray-200">
            <ClipboardPen color={"black"} />
          </View>
          <Text className="text-xl ml-4 font-psemibold">My Class</Text>
          <View className="ml-auto mr-4">
            <ArrowRightIcon color={"black"} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={logout}
          disabled={loggingOut}
          className="flex-row items-center border-b-2 min-h-[60px] my-7 border-gray-200"
        >
          <View className="size-10 flex items-center justify-center ml-3 rounded-full bg-gray-200">
            <LogOut color={"red"} />
          </View>
          <Text className="text-xl ml-4 font-psemibold text-rose-500">
            Log out
          </Text>
          {loggingOut && (
            <ActivityIndicator
              animating={loggingOut}
              color={"#f43f5e"}
              size="small"
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
