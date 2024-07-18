import { useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Toast } from "native-base";
import axios from "axios";

import { CustomButton, FormField,Butttons } from "@/components";
import { authHooks, endpoint, showToastMessage } from "@/lib";
import ToastAlert from "@/components/toast-alert"; 


type AuthProviders = "google" | "facebook" | "github";
const SignIn = () => {
  
 const {
  googleAsync,facebookAsync,gitReq, gitAsync
 }= authHooks()
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const password=form.password
    const email=form.email
    if (form.email === "" || form.password === "") {
      const id = 'sign-up';
  
      Toast.show({
        render: () => (
          <ToastAlert
            id={id}
            title="Error!"
            description="Please fill in all fields"
            status="success"
          />
        ),
      });
    }
    
    if (!password.length ){
      return  showToastMessage("Password must be atleast 8 characters")
    }
    try {

      const result = await axios.post(`${endpoint}/sign-in`,{email,password})
      console.log("res data ",result.data)
      if (result.data.token) {
        console.log(result.data.token)
      }
      router.replace("/home");
    } catch (error) {
      console.log("Sign-in",error)
      Toast.show({
        render: () => (
          <ToastAlert
            id="sign-up"
            title="Something went wrong"
            description="Please try again"
            status="success"
          />
        ),
      });
    } 
  };

  
const signInWithProvider = async (provider: AuthProviders) => {
  if (provider === 'google') return googleAsync();
  if (provider === 'facebook') return facebookAsync();
  if (provider === 'github') return gitAsync()
}


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Log in to Clevery
          </Text>
          <FormField
            title="Email" 
            value={form.email}
            handleChangeText={(e:any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e:any) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
          />

          <Butttons
            signInWithProvider={(v)=>signInWithProvider(v)}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="room"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
