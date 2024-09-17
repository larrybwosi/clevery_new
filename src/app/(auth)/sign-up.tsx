import { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, Animated } from "react-native";
import { Link, router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { endpoint, showToastMessage } from "@/lib";
import { Button, FormField } from "@/components";
import { useAuth } from "@/lib/contexts/auth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { MaterialIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

type AuthProviders = "google" | "facebook" | "github";

const SignUp = () => {
  const { loading, signIn, signUp, user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const submit = async () => {
    const { email, password, username } = form;
    if (username === "" || email === "" || password === "") {
      return showToastMessage("Please fill in all fields");
    }

    try {
      const res = await signUp(form);
      console.log(res);
      setShowWelcome(true);
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (error: any) {
      console.log("Failed to create user: ", error.message);
      showToastMessage("Failed to create user. Please try again.");
    }
  };

  const googleSignUp = async () => {
    const res = await fetch(`${endpoint}/auth/oauth?provider=google`);
    const url = await res.json().then(d => d.url);
    const response = await WebBrowser.openBrowserAsync(url);
    console.log(response);
  };

  const signInWithProvider = async (provider: AuthProviders) => {
    if (provider === 'google') return googleSignUp();
    if (provider === 'facebook') return signIn("google");
    if (provider === 'github') return signIn("github");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:' #111827' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text className="text-3xl font-rbold text-center mb-5 text-white">
            Sign Up to Clevery
          </Text>
          <Text className="text-base font-rregular text-center mb-2 text-white">
            Join our community and start your journey to mastery!
          </Text>

          <FormField
            title="Username"
            placeholder="Username"
            value={form.username}
            onChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            placeholder="Email"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Password"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            autoCapitalize="none"
          />
            <Button 
              className="rounded-lg bg-cyan-600 h-14 mb-4"
              onPress={submit}
            >
              <Text className="text-white font-rbold text-lg">Sign In</Text>
            </Button>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text className="font-rregular text-gray-400">Or sign up with:</Text>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => {
                signInWithProvider("google");
              }}
              // disabled={isInProgress}
            />
          </View>

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
            <Text className="font-rregular text-gray-400">Have an account already? </Text>
            <Link href="/sign-in" className="text-light font-rbold">
              Login
            </Link>
          </View>
        </Animated.View>

        {showWelcome && (
          <Animated.View 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center', 
              backgroundColor: 'rgba(0,0,0,0.8)',
              opacity: fadeAnim 
            }}
          >
            <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
            <Text style={{ fontSize: 24, color: '#fff', marginTop: 20 }}>Welcome aboard!</Text>
            <Text style={{ fontSize: 16, color: '#ccc', marginTop: 10, textAlign: 'center' }}>
              Your account has been created successfully. Redirecting you to the home page...
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;