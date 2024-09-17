import { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, SafeAreaView, Image } from "react-native";
import { Link, router } from "expo-router";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';
import { Button, FormField, Loader, Toast, ToastDescription, ToastTitle, useToast } from "@/components";
import { useAuth } from "@/lib/contexts/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as WebBrowser from 'expo-web-browser';
import { endpoint, useProfileStore } from "@/lib";
import { userApi } from "@/lib/actions/users";

WebBrowser.maybeCompleteAuthSession();

type AuthProviders = "google" | "facebook" | "github";

const SignIn = () => {
  const { loading, signIn, user } = useAuth();
  const {profile, setProfile} = useProfileStore()
  const [toastId, setToastId] = useState('0')
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  WebBrowser.warmUpAsync()
  const toast = useToast()
  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast({})
    }
  }
  const showNewToast = ({
    title = "Success",
    description = "You have successfully signed in.",
  }) => {
    const newId = Math.random().toString()
    setToastId(newId)
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="outline" className="bg-gray-700 p-4">
            <ToastTitle className="text-white">{title}</ToastTitle>
            <ToastDescription className="text-white">
              {description}
            </ToastDescription>
          </Toast>
        )
      },
    })
  }

  const logoScale = useSharedValue(0.5);
  const formOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1);
    formOpacity.value = withDelay(500, withSpring(1));
  }, []);
  
  useEffect(() => {
    if(profile?.id.trim()) {
      handleToast()
      router.replace('/')
    }
  }, [profile]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });

 const handleGoogleSignIn = async () => {
    await signIn("google");
    
    setTimeout(async() => {
      const user = await userApi.getCurrentUser();
      setProfile(user);
      router.replace('/');
    }, 3000);
};

  const submit = async () => {
    
    const { email, password } = form
    
    if (!email.trim()|| !password.trim()) {
  
      showNewToast({
        title:'error !',
        description:'Please fill in all fields'
      })
    }
    
    if (!password?.length ){
      return  showNewToast({
        title:'error !',
        description:'Password must be atleast 8 characters'
      })
    }
    try {

      await signIn("credentials",{
        email,
        password
      }) 
      
    } catch (error) {
      console.error("Sign-in",error)
    } 
  };

  if(loading) return <Loader loadingText="Signing in..."/>

  return (
    <SafeAreaView className="bg-gray-900 h-full">
      <ScrollView className="px-6 py-10">
        <View style={{ minHeight: Dimensions.get("window").height - 100 }} className="justify-between">
          <View>
            <Animated.View style={logoAnimatedStyle} className="items-center mb-8">
              <Image source={require('@/assets/images/icon.png')} className="w-24 h-24" />
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(200).duration(1000)}>
              <Text className="text-3xl text-white font-rbold mb-2 text-center">
                Welcome Back!
              </Text>
              <Text className="text-lg text-gray-300 font-rregular mb-8 text-center">
                We're excited to see you again. Let's get you signed in.
              </Text>
            </Animated.View>

            <Animated.View style={formAnimatedStyle}>
              <FormField
                title="Email"
                value={form.email}
                onChangeText={(e:any) => setForm({ ...form, email: e })}
                otherStyles="mb-4"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                onChangeText={(e:any) => setForm({ ...form, password: e })}
                otherStyles="mb-6"
                autoCapitalize="none"
              />

              <Button 
                className="rounded-lg bg-cyan-600 h-14 mb-4"
                onPress={submit}
              >
                <Text className="text-white font-rbold text-lg">Sign In</Text>
              </Button>

              <View className="items-center mb-6">
                <Text className="text-gray-400 font-rmedium mb-4">Or continue with</Text>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={handleGoogleSignIn}
                  className="font-rmedium"
                />
              </View>
            </Animated.View>
          </View>

          <Animated.View entering={FadeIn.delay(800).duration(1000)} className="flex-row justify-center items-center">
            <Text className="text-gray-300 font-rregular mr-2">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="text-cyan-400 font-rbold">
              Sign Up
            </Link>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;