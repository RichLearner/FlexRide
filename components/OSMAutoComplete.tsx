import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Keyboard,
} from "react-native";
import axios from "axios";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface OSMAutocompleteProps {
  icon: ImageSourcePropType;
  initialLocation?: string;
  containerStyle?: string;
  handlePress: (location: Location) => void;
}

interface OSMResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
}

const OSMAutocomplete: React.FC<OSMAutocompleteProps> = ({
  icon,
  initialLocation,
  containerStyle,
  handlePress,
}) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<OSMResult[]>([]);
  const [isListVisible, setIsListVisible] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputRef.current?.blur();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await axios.get<OSMResult[]>(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`
        );
        setResults(response.data);
        setIsListVisible(true);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    } else {
      setResults([]);
      setIsListVisible(false);
    }
  };

  const handleSelectPlace = (item: OSMResult) => {
    handlePress({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
    setQuery(item.display_name);
    setResults([]);
    setIsListVisible(false);
    Keyboard.dismiss();
  };

  return (
    <View className={`relative z-50 rounded-xl ${containerStyle}`}>
      <View className="flex-row items-center rounded-full shadow-md">
        <Image source={icon} className="w-6 h-6 ml-4" resizeMode="contain" />
        <TextInput
          ref={inputRef}
          placeholder={initialLocation || "Where do you want to go?"}
          value={query}
          onChangeText={searchPlaces}
          className="flex-1 py-3 px-4 text-base font-semibold"
          onFocus={() => setIsListVisible(true)}
        />
      </View>
      {isListVisible && results.length > 0 && (
        <View className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 z-50">
          <FlatList<OSMResult>
            data={results}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectPlace(item)}
                className="py-3 px-4 border-b border-gray-200"
              >
                <Text className="text-sm">{item.display_name}</Text>
              </TouchableOpacity>
            )}
            className="rounded-xl"
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

export default OSMAutocomplete;
