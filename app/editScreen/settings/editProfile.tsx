import { View, Text, SafeAreaView, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import FormField from "@/components/FormField";
import CustomButtom from "@/components/customButton";
import { editUser, getCurrentUser } from "@/lib/appwrite";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EditProfile = () => {
  const { setUser, user: globaluser } = useGlobalStore();
  const { data: user, isLoading: userLoading } = useQuery({
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
  const [submitting, setSubmitting] = useState(false);
  const formSchema: { bio: string; username: string; email: string } = {
    bio: user?.bio,
    username: user?.username,
    email: user?.email,
  };
  const queryClient = useQueryClient();
  const [form, setForm] = useState(formSchema);
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        setSubmitting(true);
        if (!form.username || !form.bio)
          throw new Error("Please fill all fields");
        const response = await editUser(form.username, form.bio, user?.$id);
        if (!response)
          throw new Error("An error occured while updating profile");
        setUser(response);
        Alert.alert("Success", "Profile updated successfully");
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    },
    onSuccess: () => {
      router.replace("/profile");
      queryClient.setQueryData(["user"], globaluser);
    },
  });
  const submit = async () => {
    mutate();
  };
  return (
    <SafeAreaView className="h-full">
      <View
        style={{ minHeight: Dimensions.get("window").height - 100 }}
        className="justify-center"
      >
        <View className="items-center justify-center">
          <Text className="font-pbold text-xl">Edit your profile</Text>
        </View>
        <View className="m-3 gap-y-4">
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            keyboardType="default"
          />
          <FormField
            title="Bio"
            value={form.bio}
            handleChangeText={(e) => setForm({ ...form, bio: e })}
            keyboardType="default"
          />
          <FormField
            title="Email (Unchangeable)"
            editable={false}
            value={form.email}
            handleChangeText={() => {}}
            keyboardType="default"
          />
        </View>
        <CustomButtom
          title="Confirm"
          isLoading={submitting}
          textStyles="text-white"
          handlePress={submit}
          containerStyles="m-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
