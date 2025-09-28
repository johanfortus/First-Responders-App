import React, { useState } from "react";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CreateProfile() {
  const r = useRouter();

  const [form, setForm] = useState({
    name: "",
    ecName: "",
    ecContact: "",
    ecRelation: "",
    email: "",
    ptName: "",
    ptContact: "",
    dob: "",
    gender: "Male" as "Male" | "Female",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    r.replace("/");
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Initialization of personal information</Text>
        <Text style={s.h2}>Create personal information to make contact easier</Text>

        <Section title="Name">
          <Field
            placeholder="Enter name"
            value={form.name}
            onChangeText={(v) => set("name", v)}
          />
        </Section>

        <Section title="Emergency Contact">
          <Field
            placeholder="Enter name"
            value={form.ecName}
            onChangeText={(v) => set("ecName", v)}
          />
          <Field
            placeholder="Enter contact"
            keyboardType="phone-pad"
            value={form.ecContact}
            onChangeText={(v) => set("ecContact", v)}
          />
          <Field
            placeholder="Enter relation"
            value={form.ecRelation}
            onChangeText={(v) => set("ecRelation", v)}
          />
        </Section>

        <Section title="Email">
          <Field
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => set("email", v)}
          />
        </Section>

        <Section title="Preferred Therapist">
          <Field
            placeholder="Enter name"
            value={form.ptName}
            onChangeText={(v) => set("ptName", v)}
          />
          <Field
            placeholder="Enter contact"
            keyboardType="phone-pad"
            value={form.ptContact}
            onChangeText={(v) => set("ptContact", v)}
          />
        </Section>

        <Section title="Date of birth">
          <View style={{ position: "relative" }}>
            <Field
              placeholder="Choose your date"
              value={form.dob}
              onChangeText={(v) => set("dob", v)}
            />
            <Ionicons
              name="calendar-clear-outline"
              size={18}
              color="#9CA3AF"
              style={{ position: "absolute", right: 14, top: 16 }}
            />
          </View>

          <View style={s.genderRow}>
            <Pressable
              onPress={() => set("gender", "Male")}
              style={[s.pill, form.gender === "Male" && s.pillActive]}
            >
              <Text style={[s.pillTxt, form.gender === "Male" && s.pillTxtActive]}>
                Male
              </Text>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={form.gender === "Male" ? "#fff" : "#9CA3AF"}
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            <Pressable
              onPress={() => set("gender", "Female")}
              style={[s.pill, form.gender === "Female" && s.pillActive]}
            >
              <Text style={[s.pillTxt, form.gender === "Female" && s.pillTxtActive]}>
                Female
              </Text>
              <Ionicons
                name="female-outline"
                size={16}
                color={form.gender === "Female" ? "#fff" : "#9CA3AF"}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          </View>
        </Section>

        <Pressable style={s.btn} onPress={submit}>
          <Text style={s.btnTxt}>Done</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput style={s.input} placeholderTextColor="#A1A1AA" {...props} />;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6F8FA" },
  container: { padding: 16, paddingBottom: 24 },
  h1: { color: "#0F172A", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  h2: { color: "#94A3B8", marginBottom: 16 },
  sectionTitle: { color: "#0F172A", fontWeight: "700", marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  genderRow: { flexDirection: "row", gap: 12, marginTop: 6 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  pillActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#E6F0FF",
  },
  pillTxt: { color: "#6B7280", fontWeight: "600" },
  pillTxtActive: { color: "#1D4ED8" },
  btn: {
    backgroundColor: "#F66B0E",
    borderRadius: 22,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
