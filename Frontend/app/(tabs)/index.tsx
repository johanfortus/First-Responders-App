import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
	return (
		<View>
		<Text style={styles.homeHeader}>Home</Text>
		<View style={styles.homeBanner}>
			<View style={styles.bannerTextContainer}>
			<Text style={styles.bannerHeader}>Welcome Back Name</Text>
			<Text style={styles.bannerSubHeader}>We're here for you</Text>
			</View>
			<Image source={require('../../assets/images/stroke.png')} style={styles.strokeGraphic}/>
		</View>

		{/* <Link href="../contacts" style={styles.visitLink}>Visit Contacts Page</Link>
		<Link href="../checkin" style={styles.visitLink}>Visit Checkin Page</Link> */}
		</View>
	);
}

const styles = StyleSheet.create({
	homeHeader: {
		fontSize: 24,
		fontWeight: '600',
		marginTop: 28,
		marginLeft: 20,
	},
	homeBanner: {
		justifyContent: "flex-start",
		alignItems: "flex-end",
		alignSelf: "flex-start",
		height: "37%",
		width: "90%",
		marginTop: 14,

		borderTopLeftRadius: 0,
		borderTopRightRadius: 15,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 15,
		
		backgroundColor: "#F66B0E",
	},
	visitLink: {
		marginTop: 10,
		marginBottom: 10,
		padding: 5,
		color: "white",
		backgroundColor: "#008cffff",
		borderRadius: 5,
	},
	bannerTextContainer: {
		marginTop: 48,
		marginRight: 20,
	},
	bannerHeader: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	bannerSubHeader: {
		fontSize: 14,
		marginTop: 13,
	},
	strokeGraphic: {
		position: 'absolute',
		bottom: 0,
		left: 0,
	}
})