import { cn } from "@/lib/utils";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
type Props = {
  placeholder?: string;
  otherStyles?: string;
  initialQuery?: string;
  onValueChange?: (value: string) => void;
};

const SearchBox = ({ placeholder, otherStyles, initialQuery }: Props) => {
  const [query, setQuery] = useState(initialQuery || "");
  return (
    <View className={(cn("space-y-2"), otherStyles)}>
      <View className="w-full h-16 px-4 rounded-2xl border-2 border-zinc-200 focus:border-zinc-100 flex flex-row items-center">
        <TextInput
          className="flex-1 text-base font-psemibold"
          value={query}
          placeholder={placeholder}
          placeholderTextColor="#828282"
          onChangeText={(e) => setQuery(e)}
        />
        <TouchableOpacity onPress={() => {}}>
          <Search color={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBox;
