// app/contact/preferred.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#F3F5F8",
  text: "#122B3C",
  sub: "#5B6B7C",
  primary: "#F66B0E",
  star: "#F7B500",
};

export default function PreferredTherapist() {
  const r = useRouter();

  const therapist = {
    name: "Dr. Destin Gollamudi",
    specialty: "Trauma Therapy",
    rating: 4.5,
    address: "8500 Euclid Avenue, FL",
    scheduleUrl: "",
    about:
      "Destin Gollamudi is a trauma therapist who transitioned from computer science to mental health after discovering his passion for helping trauma survivors. He uses evidence-based approaches to guide clients through recovery, creating a safe and compassionate environment where they can rebuild resilience, restore balance, and move forward with confidence.",
    photo:
      require("../assets/images/destin.jpeg"),
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Pressable style={s.iconBtn} onPress={() => r.back()}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Pressable style={s.iconBtn} onPress={() => {}}>
          <Ionicons name="bookmark-outline" size={22} color={COLORS.text} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={ therapist.photo } style={s.avatar} />
        <Text style={s.name}>{therapist.name}</Text>
        <Text style={s.specialty}>{therapist.specialty}</Text>

        <View style={s.ratingRow}>
          {renderStars(therapist.rating).map((filled, i) => (
            <Ionicons
              key={i}
              name={filled ? "star" : "star-outline"}
              size={18}
              color={COLORS.star}
              style={{ marginRight: 2 }}
            />
          ))}
          <Text style={s.ratingTxt}>{therapist.rating.toFixed(1)}</Text>
        </View>

        <View style={s.addrRow}>
          <Ionicons name="location" size={18} color="#4F7ECF" />
          <Text style={s.addrTxt}>{therapist.address}</Text>
        </View>

        <Text style={s.sectionTitle}>About</Text>
        <Text style={s.aboutTxt}>{therapist.about}</Text>
      </ScrollView>

      <View style={s.ctaWrap}>
        <Pressable
          style={s.ctaBtn}
          onPress={() => Linking.openURL(therapist.scheduleUrl)}
        >
          <MaterialIcons name="event-available" size={20} color="#fff" />
          <Text style={s.ctaTxt}>Schedule Appointment</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


function renderStars(rating: number) {
  const full = Math.floor(rating);
  return Array.from({ length: 5 }, (_, i) => i < full);
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E7EDF3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  specialty: {
    fontSize: 15,
    color: "#3E5876",
    textAlign: "center",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  ratingTxt: { marginLeft: 6, color: COLORS.sub },
  addrRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  addrTxt: { marginLeft: 6, color: COLORS.sub },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  aboutTxt: {
    color: COLORS.sub,
    lineHeight: 22,
    fontSize: 15,
  },
  ctaWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 22,
  },
  ctaBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
