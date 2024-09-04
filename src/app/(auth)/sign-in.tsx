import { useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView } from "react-native";
import { Link } from "expo-router";

import { CustomButton, FormField,Butttons, Button } from "@/components";
import { showToastMessage } from "@/lib";
import { useAuth } from "@/lib/contexts/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as WebBrowser from 'expo-web-browser';
type AuthProviders = "google" | "facebook" | "github";

WebBrowser.maybeCompleteAuthSession();
const SignIn = () => {
  const {
    loading,
    signIn,
    user
  } = useAuth()

  const handleGoogleSignIn = async () => {
    // const result = await googleSignIn();
    // if (result.success) {
    //   // Handle successful sign-in
    //   console.log('Signed in with Google:', result.idToken);
    //   // You might want to send this token to your backend
    // } else {
    //   // Handle sign-in failure
    //   console.log('Google sign-in failed:', result.error);
    // }
  };
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const password=form.password
    const email = form.email
    
    if (form.email === "" || form.password === "") {
  
      showToastMessage("Please fill in all fields")
    }
    
    if (!password?.length ){
      return  showToastMessage("Password must be atleast 8 characters")
    }
    try {

      const result = await signIn("credentials",{
        email,
        password
      })
      console.log(result)

      // showToastAlert({
      //   id: "sign-up",
      //   title: "Success",
      //   description: "You have successfully logged in",
      //   status: "success",
      // })
      // router.navigate('/editprofile')
      
    } catch (error) {
      console.log("Sign-in",error)
      // showToastAlert({
      //   id: "sign-up",
      //   title: "Error",
      //   description: "Something went wrong",
      //   status: "error",
      // })
    } 
  };

  
const signInWithProvider = async (provider: AuthProviders) => {
  if (provider === 'google') return handleGoogleSignIn();
  if (provider === 'facebook') return signIn("github");
  if (provider === 'github') return signIn("github")
}


  return (
    <SafeAreaView className="bg-black h-full">
      <ScrollView> 
        <View
          className="w-full flex justify-center h-full px-4 my-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-2xl text-white mt-10 font-rmedium">
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
            autoCapitalize="none"
          />

          <Button 
            className="rounded-lg bg-cyan-600 h-16 mt-7 mb-4 mx-7"
            onPress={()=>submit()}
          >
            <Text className="text-white font-rmedium text-base">signin</Text>
          </Button>
          <View className="w-full h-[1px] bg-gray-500"/>
            <Text className="font-rbold mt-4">
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => {
                  // initiate sign in
                }}
                // disabled={isInProgress}
              />;
            </Text>
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-md text-gray-100 font-rbold">
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
