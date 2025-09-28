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
  top: "#F2F5F8",
  heading: "#F66B0E",
  title: "#0F172A",
  meta: "#9CA3AF",
  body: "#0F2433",
};

export default function ResourceArticle() {
  const r = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['bottom']}>
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
            color={COLORS.heading}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Section tag */}
        <Text style={s.section}>Taking Care of You</Text>

        {/* Title */}
        <Text style={s.h1}>Practical strategies for daily self-care and resilience</Text>

        {/* Meta */}
        <View style={s.metaRow}>
          <Ionicons name="time-outline" size={18} color={COLORS.meta} />
          <Text style={s.metaTxt}>8 minutes read</Text>
        </View>

        {/* Body */}
        <Text style={s.p}>
          Serving your community as a firefighter/paramedic is both a stressful and rewarding job that places great strain on your physical health, mental health, and relationships. To thrive today, tomorrow, and well into retirement, prioritize these strategies for self-care now:
        </Text>

        <Text style={s.subhead}>Find a Daily Diversion for Stress</Text>
        <Text style={s.p}>
          Unplug with a hobby, music, sports, or play with your dog. Both purposeful and mindless activities build a buffer against cumulative stress.
        </Text>

        <Text style={s.subhead}>Stay Connected</Text>
        <Text style={s.p}>
          Support systems are vital. Strong ties with your crew, family, and friends are essential—don’t wait until crisis to build these relationships.
        </Text>

        <Text style={s.subhead}>Get Moving</Text>
        <Text style={s.p}>
          Exercise boosts endorphins, reduces rumination, and builds confidence. Even as a responder, daily exercise matters.
        </Text>

        <Text style={s.subhead}>Ensure Proper Food and Fluid Intake</Text>
        <Text style={s.p}>
          A balanced diet and hydration are critical for mood and cognition. Start with breakfast, eat whole foods, and drink plenty of water.
        </Text>

        <Text style={s.subhead}>Balance Busy Time with Down Time</Text>
        <Text style={s.p}>
          Too much activity can mask stress. Schedule at least one day a week to rest, reflect, and recuperate.
        </Text>

        <Text style={s.subhead}>Assume Personal Responsibility</Text>
        <Text style={s.p}>
          Resilience is linked to taking ownership of your wellbeing. No one else can do it for you.
        </Text>

        <Text style={s.subhead}>Challenge Negative Thinking</Text>
        <Text style={s.p}>
          Catch unhelpful self-talk and replace it with balanced, rational ideas. It’s not about blind positivity but realistic reframing.
        </Text>

        <Text style={s.subhead}>Know When to Ask for Help</Text>
        <Text style={s.p}>
          Persistent hopelessness, apathy, or agitation may signal a treatable health issue. Reach out to peers, loved ones, or a professional.
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
    backgroundColor: COLORS.top,
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
  subhead: { fontSize: 17, fontWeight: "700", color: COLORS.title, marginTop: 14, marginBottom: 4 },
  p: { color: COLORS.body, fontSize: 15, lineHeight: 24, marginBottom: 8 },
  footer: { marginTop: 16, fontSize: 14, lineHeight: 22, color: "#475569" },

});
