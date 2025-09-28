// app/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  navy: "#122B3C",
  navy2: "#0F2232",
  orange: "#F66B0E",
  text: "#0F172A",
  sub: "#6B7280",
  field: "#FFFFFF",
  fieldBorder: "#E5E7EB",
  bg: "#F6F8FA",
};

export default function Profile() {
  const r = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ecName, setEcName] = useState("");
  const [ecContact, setEcContact] = useState("");
  const [ecRelation, setEcRelation] = useState("");
  const [ptName, setPtName] = useState("");
  const [ptContact, setPtContact] = useState("");

  const avatar =
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Pressable onPress={() => r.back()} hitSlop={12} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          <View style={s.avatarWrap}>
            <Image source={{ uri: avatar }} style={s.avatar} />
            <Pressable style={s.camBadge}>
              <Ionicons name="camera" size={14} color={COLORS.orange} />
            </Pressable>
          </View>
        </View>

        <Label>Name</Label>
        <Input placeholder="Enter name" value={name} onChangeText={setName} />


        <Label>Email</Label>
        <Input
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <SectionTitle>Emergency Contact</SectionTitle>
        <Input placeholder="Enter name" value={ecName} onChangeText={setEcName} />
        <Input
          placeholder="Enter contact"
          keyboardType="phone-pad"
          value={ecContact}
          onChangeText={setEcContact}
        />
        <Input placeholder="Enter relation" value={ecRelation} onChangeText={setEcRelation} />

        <SectionTitle>Preferred Therapist</SectionTitle>
        <Input placeholder="Enter name" value={ptName} onChangeText={setPtName} />
        <Input
          placeholder="Enter contact"
          keyboardType="phone-pad"
          value={ptContact}
          onChangeText={setPtContact}
        />

        <Pressable style={s.saveBtn} onPress={() => {}}>
          <Text style={s.saveTxt}>Save</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}
function Input(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput style={s.input} placeholderTextColor="#A1A1AA" {...props} />;
}
function Pill({
  active,
  onPress,
  label,
  children,
}: {
  active: boolean;
  onPress: () => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={[s.pill, active && s.pillActive]}>
      <Text style={[s.pillTxt, active && s.pillTxtActive]}>{label}</Text>
      {children}
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { paddingBottom: 28 },
  header: {
    backgroundColor: COLORS.navy,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    marginTop: 24,
    width: 96,
    height: 96,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.orange,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  camBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE0CC",
  },

  label: { color: COLORS.text, fontWeight: "700", marginBottom: 8, fontSize: 16, paddingHorizontal: 18 },
  sectionTitle: { color: COLORS.text, fontWeight: "700", marginTop: 10, marginBottom: 8, fontSize: 16, paddingHorizontal: 18 },

  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.field,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    paddingHorizontal: 14,
    marginBottom: 14,
    marginHorizontal: 18,
  },

  row: { flexDirection: "row", gap: 14, marginBottom: 14, paddingHorizontal: 18 },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  pillActive: { borderColor: "#3B82F6", backgroundColor: "#E6F0FF" },
  pillTxt: { color: "#6B7280", fontWeight: "700" },
  pillTxtActive: { color: "#1D4ED8" },

  saveBtn: {
    marginTop: 6,
    backgroundColor: COLORS.navy2,
    height: 60,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
  },
  saveTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
