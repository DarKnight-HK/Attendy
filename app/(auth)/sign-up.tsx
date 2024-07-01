import FormField from "@/components/FormField";
import CustomButtom from "@/components/customButton";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { createUser, getClass } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/lib/validator";
import { router } from "expo-router";
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

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalStore();
  const submit = async () => {
    try {
      setIsSubmitting(true);
      if (!validateEmail(form.email.trim())) {
        Alert.alert("Error", "Please enter a valid email address");
      } else if (!validatePassword(form.password)) {
        Alert.alert("Error", "Password must be at least 8 characters long");
      } else if (!validateUsername(form.username.trim())) {
        Alert.alert("Error", "Username must be at least 3 characters long");
      } else {
        const result = await createUser(
          form.email.trim(),
          form.password,
          form.username.trim()
        );
        setUser(result);
        setIsLoggedIn(true);

        router.replace("/requiredSteps/forcedClassScreen");
      }
    } catch (e: any) {
      console.log(e);
      Alert.alert("Error", e.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [form, setForm] = useState({
    username: "",
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
          <Text className="font-pbold text-2xl">Create an account</Text>
          <Text className="font-pregular text-md mt-3">
            Enter your credentials to sign up for this app
          </Text>
          <FormField
            title="Username"
            keyboardType="default"
            handleChangeText={(e) => {
              setForm({ ...form, username: e.trim() });
            }}
            value={form.username}
            placeholder="Enter your Username"
            otherStyles="mt-7"
          />
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
            title="Sign up"
            containerStyles="w-full mt-7"
            textStyles="text-white"
            handlePress={submit}
            isLoading={submitting}
          />

          <Text className="mt-7 text-zinc-400">Already have an account?</Text>
          <TouchableOpacity onPress={() => router.replace("/sign-in")}>
            <Text className="text-base text-zinc-600 mt-2 font-pmedium">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
