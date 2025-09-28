import React from "react";
import {
  View,
  Text,
  StyleSheet,
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
  cardBg: "#FFFFFF",
};

export default function Profile() {
  const r = useRouter();

  const avatar =
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop";

  const menuItems = [
    // {
    //   icon: "person-outline",
    //   title: "Edit Profile",
    //   subtitle: "Update your personal information",
    //   onPress: () => r.push("/edit_profile"),
    //   color: "#3B82F6",
    // },
    {
      icon: "shield-checkmark-outline",
      title: "Mental Health Resources",
      subtitle: "Access support materials",
      onPress: () => r.push("/contacts"),
      color: "#10B981",
    },
    {
      icon: "call-outline",
      title: "Emergency Contacts",
      subtitle: "Quick access to support",
      onPress: () => r.push("/contacts"),
      color: "#EF4444",
    },
    {
      icon: "document-text-outline",
      title: "Terms and Policy",
      subtitle: "Privacy and usage guidelines",
      onPress: () => {},
      color: "#6366F1",
    },
    {
      icon: "help-circle-outline",
      title: "Frequently Asked Questions",
      subtitle: "Get help and support",
      onPress: () => {},
      color: "#8B5CF6",
    },
    {
      icon: "log-out-outline",
      title: "Log Out",
      subtitle: "Sign out of your account",
      onPress: () => {},
      color: "#6B7280",
    },
  ];

  return (
    <SafeAreaView style={s.container} edges={['bottom']}>
      <ScrollView style={s.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={s.profileSection}>
          <View style={s.profileInfo}>
            <View style={s.avatarContainer}>
              <Image source={{ uri: avatar }} style={s.avatar} />
              <View style={s.cameraIcon}>
                <Ionicons name="camera" size={12} color={COLORS.orange} />
              </View>
            </View>
            <View style={s.profileText}>
              <Text style={s.profileName}>First Responder Name</Text>
              <Pressable style={s.personalInfoRow} onPress={() => r.push("/edit_profile")}>
                <Text style={s.personalInfoText}>Personal Information</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.sub} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={s.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={s.menuCard} onPress={item.onPress}>
              <View style={[s.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={s.menuContent}>
                <Text style={s.menuTitle}>{item.title}</Text>
                <Text style={s.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.sub} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  profileSection: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  personalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfoText: {
    fontSize: 14,
    color: COLORS.sub,
    marginRight: 4,
  },
  notificationIcon: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.sub,
  },
});