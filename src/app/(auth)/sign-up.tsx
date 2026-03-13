import { useState } from "react";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { View, Text, ScrollView, Animated } from "react-native";
import { Link, router } from "expo-router";

import { Button, FormField } from "@/components";
import { useAuth } from "@/lib/contexts/auth";
import { showToastMessage } from "@/lib";

const SignUp = () => {
  const { loading, signIn, signUp } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const submit = async () => {
    const { email, password, username } = form;
    if (!username.trim() || !email.trim() || !password.trim()) {
      return showToastMessage("Please fill in all fields");
    }
    if (password.length < 8) {
      return showToastMessage("Password must be at least 8 characters");
    }
    try {
      await signUp(form);
      router.replace("/welcome");
    } catch (error: any) {
      showToastMessage(error?.message ?? "Failed to create user. Please try again.");
    }
  };

 const handleGoogleSignIn = async () => {
    await signIn("google");
    router.replace('/');
};

  return (
    <View style={{ flex: 1, backgroundColor:'#111827' }}>
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
              className="rounded-lg bg-cyan-600 h-14 mb-4 mt-4"
              onPress={submit}
            >
              <Text className="text-white font-rbold text-lg">Sign In</Text>
            </Button>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text className="font-rregular text-gray-400">Or sign up with:</Text>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}
              disabled={loading}
            />
          </View>

          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
            <Text className="font-rregular text-gray-400">Have an account already? </Text>
            <Link href="/sign-in" className="text-light font-rbold">
              Login
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default SignUp;