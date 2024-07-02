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
  LogOut,
  Settings,
  User,
} from "lucide-react-native";
import CustomButtom from "@/components/customButton";
import { router } from "expo-router";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { changePfp, getCurrentUser, signOut } from "@/lib/appwrite";

const Profile = () => {
  const formSchema: { avatar: any } = { avatar: null };
  const [pfp, setPfp] = useState(formSchema);
  const { user, setIsLoggedIn, setUser } = useGlobalStore();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };
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
  const openPicker = async () => {};
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
                source={{ uri: user?.avatar }}
                className="rounded-full w-[90%] h-[90%]"
                resizeMode="cover"
              />
              <View className="absolute right-[-7] bottom-[-4] size-9 rounded-lg border flex items-center justify-center border-white bg-black">
                <Camera color={"white"} />
              </View>
            </TouchableOpacity>
          )}
          <View className="flex items-center justify-center gap-y-2">
            <Text className="font-pbold text-2xl">{user?.username}</Text>
            <Text className="text-base text-black font-pregular">
              {user?.bio === '""' ? "" : user?.bio}
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
            router.push("/editScreen/settings/editProfile");
          }}
          className="flex-row items-center border-b-2 min-h-[60px] my-7 border-gray-200"
        >
          <View className="size-10 flex items-center justify-center ml-3 rounded-full bg-gray-200">
            <User color={"black"} />
          </View>
          <Text className="text-xl ml-4 font-psemibold">My Profile</Text>
          <View className="ml-auto mr-4">
            <ArrowRightIcon color={"black"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push("/editScreen/settings/settings");
          }}
          className="flex-row items-center border-b-2 min-h-[60px] my-7 border-gray-200"
        >
          <View className="size-10 flex items-center justify-center ml-3 rounded-full bg-gray-200">
            <Settings color={"black"} />
          </View>
          <Text className="text-xl ml-4 font-psemibold">Settings</Text>
          <View className="ml-auto mr-4">
            <ArrowRightIcon color={"black"} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={logout}
          className="flex-row items-center border-b-2 min-h-[60px] my-7 border-gray-200"
        >
          <View className="size-10 flex items-center justify-center ml-3 rounded-full bg-gray-200">
            <LogOut color={"red"} />
          </View>
          <Text className="text-xl ml-4 font-psemibold text-rose-500">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
