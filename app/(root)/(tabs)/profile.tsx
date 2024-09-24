import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import DetailField from "@/components/DetailField";
import { icons } from "@/constants";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex flex-row items-center justify-between my-5">
          <Text className="text-2xl font-JakartaExtraBold">Your Profile</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex flex-row items-center space-x-2"
          >
            <Text className="text-md font-JakartaSemiBold text-red-400">
              Sign Out
            </Text>
            <View className="justify-center items-center w-10 h-10 rounded-full bg-white">
              <Image source={icons.out} className="w-4 h-4" />
            </View>
          </TouchableOpacity>
        </View>
        <View className="flex items-center justify-center">
          <Image
            source={{ uri: user?.imageUrl }}
            className="w-24 h-24 rounded-full border-[3px] border-white shadow-sm shadow-neutral-300"
            resizeMode="contain"
            style={{ borderColor: "white", borderWidth: 3 }}
          />
        </View>

        <View className="flex bg-white px-5 mt-10 rounded-2xl py-5">
          <DetailField
            label="First Name"
            labelStyle="text-gray-500"
            icon={icons.edit}
            value={user?.firstName!}
            inputStyle="text-black"
            editable={false}
          />

          <DetailField
            label="Last Name"
            labelStyle="text-gray-500"
            icon={icons.edit}
            textContentType="emailAddress"
            value={user?.lastName!}
            editable={false}
          />

          <DetailField
            label="Email"
            labelStyle="text-gray-500"
            icon={icons.edit}
            textContentType="emailAddress"
            value={user?.emailAddresses[0]?.emailAddress}
            editable={false}
          />

          <DetailField
            label="Email status"
            labelStyle="text-gray-500"
            textContentType="emailAddress"
            value={user?.primaryEmailAddress?.verification.status}
            inputStyle={`${user?.primaryEmailAddress?.verification.status === "verified" ? "text-green-500" : "text-red-500"}`}
            editable={false}
          />

          <DetailField
            label="Phone Number"
            labelStyle="text-gray-500"
            icon={icons.edit}
            textContentType="emailAddress"
            value={user?.phoneNumbers[0]?.phoneNumber}
            editable={false}
          />
        </View>

        <CustomButton
          title="Update Profile"
          className="mt-10"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
