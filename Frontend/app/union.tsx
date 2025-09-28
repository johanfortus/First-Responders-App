import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  bg: "#F5F6F8",
  text: "#122B3C",
  sub: "#3E5876",
  star: "#F7B500",
  divider: "#E6E9EF",
  cta: "#F66B0E",
};

type Person = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  photo: string;
};

const UNION_LIST: Person[] = [
  {
    id: "1",
    name: "Dr. Michael Carter",
    specialty: "Trauma Therapy",
    rating: 4.5,
    photo: "https://images.unsplash.com/photo-1573497161161-5c2f6f06c6f9?w=256&h=256&fit=crop",
  },
  {
    id: "2",
    name: "Dr. Kenny Rivera",
    specialty: "Trauma Therapy",
    rating: 4.5,
    photo: "https://images.unsplash.com/photo-1603415526960-f7e0328d13ff?w=256&h=256&fit=crop",
  },
  {
    id: "3",
    name: "Dr. David Kim",
    specialty: "Cognitive Behavioral Therapy (CBT)",
    rating: 4.5,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&h=256&fit=crop",
  },
  {
    id: "4",
    name: "Dr. Anna Lopez",
    specialty: "PTSD & First Responder Support",
    rating: 4.5,
    photo: "https://images.unsplash.com/photo-1544005316-04ce1f4a2a88?w=256&h=256&fit=crop",
  },
  {
    id: "5",
    name: "Dr. Michelle Connor",
    specialty: "Family & Crisis Counseling",
    rating: 4.5,
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&h=256&fit=crop",
  },
];

export default function UnionTherapist() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const r = useRouter();

  const renderItem = ({ item }: { item: Person }) => {
    const selected = item.id === selectedId;
    return (
      <Pressable
        onPress={() => setSelectedId(item.id)}
        style={[s.row, selected && s.rowSelected]}
      >
        <Image source={{ uri: item.photo }} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.spec}>{item.specialty}</Text>
          <View style={s.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.floor(item.rating) ? "star" : "star-outline"}
                size={16}
                color={COLORS.star}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={s.ratingTxt}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <Pressable onPress={() => r.back()} hitSlop={12} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={s.header}>Select Union Therapist</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={UNION_LIST}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={s.sep} />}
        contentContainerStyle={s.listPad}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={[s.cta, !selectedId && s.ctaDisabled]}
        onPress={() => {
          if (!selectedId) return;
          r.push("/preferred");
        }}
      >
        <Text style={s.ctaTxt}>Confirm</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  header: {
    flex: 1,
    textAlign: "center",
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },
  listPad: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 14,
  },
  rowSelected: {
    backgroundColor: "rgba(246,107,14,0.06)",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#E8EEF5",
  },
  name: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  spec: { color: COLORS.sub, marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingTxt: { marginLeft: 6, color: COLORS.sub },
  sep: { height: 1, backgroundColor: COLORS.divider },
  cta: {
    position: "absolute",
    left: 20, right: 20, bottom: 24,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.cta,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { opacity: 0.5 },
  ctaTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
