import { useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { Link, router } from "expo-router";

import { CustomButton, FormField,Butttons } from "@/components";
import { showToastMessage } from "@/lib";
import { showToastAlert } from "@/components/toast-alert";
import { useAuth } from "@/lib/contexts/auth";

type AuthProviders = "google" | "facebook" | "github";
const SignIn = () => {
  const {
    loading,
    signIn,
    user
  } = useAuth()
  
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const password=form.password
    const email=form.email
    if (form.email === "" || form.password === "") {
  
      showToastMessage("Please fill in all fields")
    }
    
    if (!password.length ){
      return  showToastMessage("Password must be atleast 8 characters")
    }
    try {

      const result = await signIn("credentials",{
        email,
        password
      })

      showToastAlert({
        id: "sign-up",
        title: "Success",
        description: "You have successfully logged in",
        status: "success",
      })
      router.navigate('/editprofile')
      
    } catch (error) {
      console.log("Sign-in",error)
      showToastAlert({
        id: "sign-up",
        title: "Error",
        description: "Something went wrong",
        status: "error",
      })
    } 
  };

  
const signInWithProvider = async (provider: AuthProviders) => {
  if (provider === 'google') return signIn("google");
  if (provider === 'facebook') return signIn("github");
  if (provider === 'github') return signIn("github")
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
            autoCapitalize="none"
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
