import { Tabs } from "expo-router";
import {
  CircleUserRound,
  ClipboardPenLine,
  GraduationCap,
  Home,
  School,
} from "lucide-react-native";
import { View, Text } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9B9B9B",
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F8F8FA",
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View className="gap-2 flex items-center justify-center">
              <Home size={24} color={focused ? "black" : "gray"} />
              <Text
                className={`${
                  focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          headerShown: false,
          title: "Classes",
          tabBarIcon: ({ focused, color }) => (
            <View className="gap-2 flex items-center justify-center">
              <School size={24} color={focused ? "black" : "gray"} />
              <Text
                className={`${
                  focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
              >
                Classes
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="attendence"
        options={{
          headerShown: false,
          title: "Attendence",
          tabBarIcon: ({ focused, color }) => (
            <View className="gap-2 flex items-center justify-center">
              <ClipboardPenLine size={24} color={focused ? "black" : "gray"} />
              <Text
                className={`${
                  focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
              >
                Attendence
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          headerShown: false,
          title: "Students",
          tabBarIcon: ({ focused, color }) => (
            <View className="gap-2 flex items-center justify-center">
              <GraduationCap size={24} color={focused ? "black" : "gray"} />
              <Text
                className={`${
                  focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
              >
                Students
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <View className="gap-2 flex items-center justify-center">
              <CircleUserRound size={24} color={focused ? "black" : "gray"} />
              <Text
                className={`${
                  focused ? "font-psemibold" : "font-pregular"
                } text-xs`}
                style={{ color: color }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
