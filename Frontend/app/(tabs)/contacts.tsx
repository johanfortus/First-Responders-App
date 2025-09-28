import { View, Text, StyleSheet, Pressable, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  bg: "#F3F5F8",
  card: "#FFFFFF",
  primary: "#F66B0E",
  text: "#122B3C",
  sub: "#475569",
  border: "#E2E8F0",
};

export default function Contacts() {
  const r = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerWrap}>
        <Text style={s.header}>Contact Support</Text>
        
      </View>

      <ScrollView contentContainerStyle={s.container}>
        <ContactItem
          icon={<MaterialCommunityIcons name="handshake" size={28} color="#fff" />}
          label="Union Therapist"
          onPress={() => r.push("/union")}
        />
        <ContactItem
          icon={<Ionicons name="location-outline" size={28} color="#fff" />}
          label="Local Therapist"
          onPress={() => r.push("/union")}
        />
        <ContactItem
          icon={<Ionicons name="bookmark-outline" size={28} color="#fff" />}
          label="Preferred Therapist"
          onPress={() => r.push("/preferred")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={s.item} onPress={onPress}>
      <View style={s.iconTile}>{icon}</View>
      <Text style={s.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={COLORS.sub} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  headerWrap: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.bg,
    alignItems: "center",
  },
  header: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "600",
    lineHeight: 32,
    letterSpacing: -0.02,
    marginTop: 80,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  item: {
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  iconTile: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
