import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  bg: "#FFFFFF",
  heading: "#F66B0E",
  title: "#0F172A",
  meta: "#9CA3AF",
  body: "#0F2433",
};

export default function ResourceFamilyConnection() {
  const r = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={s.top}>
        <Pressable accessibilityRole="button" onPress={() => r.back()} style={s.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.title} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setSaved((v) => !v)}
          style={s.iconBtn}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={COLORS.title}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.section}>The Power of Family & Connection</Text>

        <Text style={s.h1}>A lifeline for fire fighter mental health</Text>

        <View style={s.metaRow}>
          <Ionicons name="time-outline" size={18} color={COLORS.meta} />
          <Text style={s.metaTxt}>10 minutes read</Text>
        </View>

        <Text style={s.p}>
          The job asks a lot—physical danger, exposure to trauma, and long hours that
          can strain relationships. Strong connections with your spouse, family, friends,
          and crew are one of the best buffers against stress and a key protector of
          mental health.
        </Text>

        <Text style={s.subhead}>Why connection matters</Text>
        <Text style={s.p}>
          Humans are wired for belonging. Supportive relationships increase resilience,
          give perspective, and reduce isolation, two feelings linked to higher suicide
          risk (feeling like a burden and feeling you don’t belong).
        </Text>

        <Text style={s.subhead}>Common relationship stressors</Text>
        <Text style={s.p}>
          Irregular schedules, cumulative stress, and bringing work home can create
          distance. Proactively protect time with loved ones and keep communication
          open, even when you’re tired.
        </Text>

        <Text style={s.rule}>FIVE PITFALLS TO AVOID</Text>

        <Text style={s.subnum}>1) Don’t hold things in</Text>
        <Text style={s.p}>
          Bottling stress increases isolation. Schedule a weekly distraction-free
          check-in with your partner; be clear if you want a listener, support, or advice.
        </Text>

        <Text style={s.subnum}>2) Don’t avoid talking about work at home</Text>
        <Text style={s.p}>
          You can share honestly without graphic details. Mention tough shifts or proud
          moments so loved ones understand what you’re carrying and can support you.
        </Text>

        <Text style={s.subnum}>3) Don’t shrink your circle to only fire fighters</Text>
        <Text style={s.p}>
          Crews “get it,” but family and non-fire friends add balance and joy. Shared
          hobbies and everyday time together refresh your identity beyond the job.
        </Text>

        <Text style={s.subnum}>4) Don’t ignore concern from loved ones</Text>
        <Text style={s.p}>
          They notice early changes in mood, sleep, or withdrawal. Treat their
          observations as care; explore what they’re seeing and address it together.
        </Text>

        <Text style={s.subnum}>5) Don’t forget hobbies and roles outside the job</Text>
        <Text style={s.p}>
          Build identities you control: parent, partner, coach, maker, hiker. These
          roles reduce burnout and keep you grounded when work is intense or
          unpredictable.
        </Text>

        <Text style={s.subhead}>Bottom line</Text>
        <Text style={s.p}>
          Your relationships aren’t a “nice to have”, they’re protective equipment for
          your mind. Invest in them on good days so they’re strong on hard days.
        </Text>

        <Text style={s.footer}>
          Need support now?{"\n"}
          • Firestrong: 1-844-525-3473{"\n"}
          • 988 Suicide & Crisis Lifeline (call/text 988){"\n"}
          • IAFF Center of Excellence: 1-855-900-8437
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  section: {
    color: COLORS.heading,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  h1: {
    color: COLORS.title,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    marginBottom: 10,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 18 },
  metaTxt: { color: COLORS.meta, fontSize: 15 },

  rule: {
    marginTop: 6,
    marginBottom: 6,
    color: COLORS.heading,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  subhead: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.title,
    marginTop: 14,
    marginBottom: 4,
  },
  subnum: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.title,
    marginTop: 12,
    marginBottom: 2,
  },
  p: { color: COLORS.body, fontSize: 15, lineHeight: 24, marginBottom: 8 },
  footer: { marginTop: 16, fontSize: 14, lineHeight: 22, color: "#475569" },
});
