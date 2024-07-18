import { useState } from "react";
import { Link } from "expo-router";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField,Butttons } from "@/components";
import { authHooks, endpoint, showToastMessage } from "@/lib";
import axios from "axios";
import { useToast } from "native-base";
import ToastAlert from "@/components/toast-alert";
import { Badge } from "@/components/badges/user";

type AuthProviders = "google" | "facebook" | "github";
const SignIn = () => {
  
 const {
  googleAsync,facebookAsync,gitReq, gitAsync
 }= authHooks()
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const toast = useToast();
// const {
//   mutateAsync:createUser,
//   isPending:creating,
//   isError:error
// } = useCreateUser()

  const submit = async () => {
    const password=form.password
    const email=form.email
    if (form.email === "" || form.password === "") {
      return  toast.show({
        title: "Error , Please fill in all fields",
        placement: "top"
      })
    }
    
    if (!password.length ){
      return  toast.show({
        title: "Password must be atleast 8 characters",
        placement: "top"
      })
    }
    try {

      const result = await axios.post(`${endpoint}/sign-in`,{email,password})
      console.log("res data ",result.data)
      return<ToastAlert title="Something went wrong" description="Please try again"id="sign-up" />
      // await signIn(form.email, form.password);
      // const result = await getCurrentUser();
      // setUser(result);
      // setIsLogged(true);

      // Alert.alert("Success", "User signed in successfully");
      // router.replace("/home");
    } catch (error) {
      console.log("Sign-in",error)
      return<ToastAlert title="Something went wrong" description="Please try again"id="sign-up" />
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
