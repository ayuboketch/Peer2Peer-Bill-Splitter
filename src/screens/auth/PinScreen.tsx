import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../services/supabase/supabase";

export default function PinScreen() {
  const [pin, setPin] = useState("");
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleVerifyPin = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("pin")
      .eq("id", user.id)
      .single();

    if (data?.pin === pin) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        })
      );
    } else {
      Alert.alert("Invalid PIN", "Please try again.");
    }
  };

  return (
    <View>
      <Text>Enter your PIN</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      <Button title="Unlock" onPress={handleVerifyPin} />
    </View>
  );
}
