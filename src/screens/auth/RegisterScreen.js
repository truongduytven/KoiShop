import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = () => {
    axios
      .post("https://koi-api.uydev.id.vn/api/v1/users/register", {
        email,
        password,
        fullName,
        dob: dob.toISOString(),
        phoneNumber,
        imageUrl,
        address,
      })
      .then((response) => {
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.message;
          Alert.alert("Error", errorMessage);
        } else {
          console.error(error);
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      });
  };

  return (
    <View className="flex-1 justify-center p-4 bg-primary">
      <Text className="text-3xl mb-6 text-center font-bold text-tertiary text-white">
        Register
      </Text>
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#6d1a1a"
      />
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#6d1a1a"
      />
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#6d1a1a"
      />
      <TouchableOpacity
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white justify-center"
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: dob ? "#000" : "#6d1a1a" }}>
          {dob ? dob.toISOString().split("T")[0] : "Date of Birth"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
          }}
        />
      )}
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor="#6d1a1a"
      />
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-4 px-4 bg-white"
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholderTextColor="#6d1a1a"
      />
      <TextInput
        className="h-12 border border-gray-400 rounded-lg mb-6 px-4 bg-white"
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        placeholderTextColor="#6d1a1a"
      />
      <TouchableOpacity
        className="bg-secondary py-3 rounded-lg"
        onPress={handleRegister}
      >
        <Text className="text-center text-white text-lg">Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
