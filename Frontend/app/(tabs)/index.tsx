import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <Link href="../contacts" style={styles.visitLink}>Visit Contacts Page</Link>
      <Link href="../checkin" style={styles.visitLink}>Visit Checkin Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
  homeHeader: {
    fontFamily: 
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