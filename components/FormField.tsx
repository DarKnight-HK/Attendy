import { cn } from "@/lib/utils";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
type Props = {
  title: string;
  value: string;
  placeholder?: string;
  keyboardType: "email" | "password" | "default" | "numeric" | "creditHours";
  otherStyles?: string;
  editable?: boolean;
  handleChangeText: (e: any) => void;
};

const FormField = ({
  title,
  value,
  placeholder,
  keyboardType,
  otherStyles,
  handleChangeText,
  editable = true,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={(cn("space-y-2"), otherStyles)}>
      <Text className="text-base text-zinc-600 pl-2 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 rounded-2xl border-2 border-zinc-200 focus:border-zinc-100 flex flex-row items-center">
        <TextInput
          editable={editable}
          className="flex-1 text-base font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#828282"
          inputMode={
            keyboardType === "numeric" || keyboardType === "creditHours"
              ? "numeric"
              : "text"
          }
          maxLength={
            keyboardType === "creditHours"
              ? 1
              : keyboardType === "numeric"
              ? 3
              : undefined
          }
          onChangeText={handleChangeText}
          secureTextEntry={keyboardType === "password" && !showPassword}
          {...props}
        />
        {keyboardType === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <Eye color={"grey"} size={24} />
            ) : (
              <EyeOff color={"grey"} size={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
