import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View>
      <Text style={styles.homeHeader}>Home</Text>
      <View>
        
      </View>
      <Link href="../contacts" style={styles.visitLink}>Visit Contacts Page</Link>
      <Link href="../checkin" style={styles.visitLink}>Visit Checkin Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 28,
  },
  visitLink: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    color: "white",
    backgroundColor: "#008cffff",
    borderRadius: 5,
  }
})