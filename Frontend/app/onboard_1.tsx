import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Onboard1() {
  const r = useRouter();

  return (
    <SafeAreaView style={s.screen}>
      <Pressable style={s.skip} onPress={() => r.replace("/create_profile")}>
        <Text style={s.skipTxt}>Skip</Text>
      </Pressable>

      <Image
        source={require("../assets/images/onboarding_1.jpg")}
        style={s.img}
        resizeMode="contain"
      />

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={s.title}>
          Connect with resources{"\n"}and Support Contacts
        </Text>
        <Text style={s.sub}>
          Schedule appointments, call, and{"\n"}chat with trained proffessionals
        </Text>
      </View>

      <View style={s.dots}>
        <View style={[s.dot, s.dotActive]} />
        <View style={s.dot} />
        <View style={s.dot} />
      </View>

      <Pressable style={s.btn} onPress={() => r.push("/onboard_2")}>
        <Text style={s.btnTxt}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FA" },
  skip: { alignSelf: "flex-end", padding: 20 },
  skipTxt: { color: "#122B3C", fontSize: 16, fontWeight: "600" },
  img: { width: "100%", height: 260, marginTop: 20 },
  title: {
    marginTop: 16,
    color: "#0F172A",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 30,
  },
  sub: {
    marginTop: 12,
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#F2C7A5" },
  dotActive: { backgroundColor: "#F66B0E", width: 16 },
  btn: {
    backgroundColor: "#F66B0E",
    borderRadius: 22,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 18,
  },
  btnTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
