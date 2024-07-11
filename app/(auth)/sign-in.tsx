import FormField from "@/components/FormField";
import CustomButtom from "@/components/customButton";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getClass, signIn } from "@/lib/appwrite";

import { validateEmail, validatePassword } from "@/lib/validator";
import { useQuery } from "@tanstack/react-query";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalStore();
  const { data, isLoading, status } = useQuery({
    initialData: [],
    queryKey: ["CLASS"],
    queryFn: async () => {
      try {
        const data = await getClass();
        if (!data) return [];
        return data;
      } catch (error) {
        console.log("Error in fetching class: ", error);
        return [];
      }
    },
  });
  if (!isLoading) {
    if (data.length > 0) {
      return <Redirect href="/home" />;
    }
  }
  const submit = async () => {
    try {
      setIsSubmitting(true);
      if (!validateEmail(form.email.trim())) {
        Alert.alert("Error", "Please enter a valid email address");
      } else if (!validatePassword(form.password)) {
        Alert.alert("Error", "Password must be at least 8 characters long");
      } else {
        const result = await signIn(form.email.trim(), form.password);
        setUser(result);
        setIsLoggedIn(true);

        if (data.length === 0 && status === "success")
          router.replace("/requiredSteps/forcedClassScreen");
        else {
          router.replace("/home");
        }
      }
    } catch (e: any) {
      console.log(e);
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setIsSubmitting] = useState(false);
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View
          className="w-full h-full items-center justify-center px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="mb-24 font-pextrabold text-3xl">HEX</Text>
          <Text className="font-pbold text-2xl">Login to your account</Text>
          <Text className="font-pregular text-md mt-3">
            Enter your credentials to sign in to this app
          </Text>
          <FormField
            title="Email"
            keyboardType="email"
            handleChangeText={(e) => {
              setForm({ ...form, email: e.trim() });
            }}
            value={form.email}
            placeholder="Enter your Email"
            otherStyles="mt-7"
          />
          <FormField
            title="Password"
            keyboardType="password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            value={form.password}
            placeholder="Enter your Password"
            otherStyles="mt-7"
          />
          <CustomButtom
            title="Sign In"
            containerStyles="w-full mt-7"
            textStyles="text-white"
            handlePress={submit}
            isLoading={submitting}
          />

          <Text className="mt-7 text-zinc-400">Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text className="text-base mt-2 text-zinc-600 font-pmedium">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
