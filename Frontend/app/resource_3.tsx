import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  bg: "#fff",
  top: "#F2F5F8",
  heading: "#F66B0E",
  title: "#0F172A",
  meta: "#9CA3AF",
  body: "#0F2433",
};

export default function Resource3() {
  const r = useRouter();
  const url =
    "https://www.iaffrecoverycenter.com/continuing-education/approaching-a-member-in-need";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={s.top}>
        <Pressable onPress={() => r.back()} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.title} />
        </Pressable>
      </View>

      <View style={s.content}>
        <Text style={s.section}>Video Resource</Text>
        <Text style={s.h1}>Approaching a Member in Need</Text>

        <View style={s.metaRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.meta} />
            <Text style={s.metaTxt}>2 hour watch</Text>
        </View>
        <Text style={s.p}>
          This resource from the IAFF Center of Excellence explains strategies
          for recognizing and supporting members who may be struggling. Click
          below to view the full video.
        </Text>
        <Text style={s.footer}>
           Need support now?{"\n"}
            • Firestrong: 1-844-525-3473{"\n"}
            • 988 Suicide & Crisis Lifeline (call/text 988){"\n"}
            • IAFF Center of Excellence: 1-855-900-8437
        </Text>

        <Pressable style={s.btn} onPress={() => Linking.openURL(url)}>
          <Ionicons name="play-circle-outline" size={22} color="#fff" />
          <Text style={s.btnTxt}>Watch Video</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: {
    backgroundColor: COLORS.top,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 20 },
  section: {
    color: COLORS.heading,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  h1: {
    color: COLORS.title,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 18 },
  metaTxt: { color: COLORS.meta, fontSize: 15 },
  p: { color: COLORS.body, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.heading,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 8,
  },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { marginTop: 16, fontSize: 14, lineHeight: 22, color: "#475569" },

});
