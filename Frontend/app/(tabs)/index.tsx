import { Text, View, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import makeCall from "../../utils/makeCall";
import sendSMS from "../../utils/sendSMS";
import ImportantNumbers from "../ImportantNumbers";
import ResourcesModal from "../ResourcesModal";
import WebSocketClient from "../../components/WebSocketClient";

export default function Index() {
	const [numbersModalVisible, setNumbersModalVisible] = useState(false);
	const [resourcesModalVisible, setResourcesModalVisible] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
				<Text style={styles.homeHeader}>Home</Text>
				<View style={styles.homeBanner}>
					<View style={styles.bannerTextContainer}>
						<Text style={styles.bannerHeader}>Welcome Back Name</Text>
						<Text style={styles.bannerSubHeader}>We're here for you</Text>
					</View>
					<Image source={require('../../assets/images/stroke.png')} style={styles.strokeGraphic}/>
				</View>
				<WebSocketClient userid="user_001" token="GFDSINE#4^&34KFV" />

				{/* <Link href="../contacts" style={styles.visitLink}>Visit Contacts Page</Link>
				<Link href="../checkin" style={styles.visitLink}>Visit Checkin Page</Link> */}

				<View style={styles.sectionContainer}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Important Numbers</Text>
						<TouchableOpacity onPress={() => setNumbersModalVisible(true)}>
							<Text style={styles.seeAllLink}>See All</Text>
						</TouchableOpacity>
					</View>
					
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactCardsContainer}>
						<View style={styles.contactCard}>
							<Text style={styles.contactName}>988 Lifeline</Text>
							<TouchableOpacity onPress={() => makeCall('988')}>
								<Text style={styles.contactActions}>Call</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.contactCard}>
							<Text style={styles.contactName}>Frontline Helpline</Text>
							<TouchableOpacity onPress={() => sendSMS('741741', 'FRONT')}>
								<Text style={styles.contactActions}>Message</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.contactCard}>
							<Text style={styles.contactName}>Crisis Text Line</Text>
							<TouchableOpacity onPress={() => sendSMS('741741', 'HOME')}>
								<Text style={styles.contactActions}>Message</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>

				<View style={styles.sectionContainer}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Resources</Text>
						<TouchableOpacity onPress={() => setResourcesModalVisible(true)}>
							<Text style={styles.seeAllLink}>See All</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Modal
					animationType="slide"
					transparent={true}
					visible={numbersModalVisible}
					onRequestClose={() => setNumbersModalVisible(false)}
				>
					<SafeAreaView style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Important Numbers</Text>
								<TouchableOpacity 
									onPress={() => setNumbersModalVisible(false)}
									style={styles.closeButton}
								>
									<Text style={styles.closeButtonText}>×</Text>
								</TouchableOpacity>
							</View>
							<ImportantNumbers />
						</View>
					</SafeAreaView>
				</Modal>

				<Modal
					animationType="slide"
					transparent={true}
					visible={resourcesModalVisible}
					onRequestClose={() => setResourcesModalVisible(false)}
				>
					<SafeAreaView style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Resources</Text>
								<TouchableOpacity 
									onPress={() => setResourcesModalVisible(false)}
									style={styles.closeButton}
								>
									<Text style={styles.closeButtonText}>×</Text>
								</TouchableOpacity>
							</View>
							<ResourcesModal />
						</View>
					</SafeAreaView>
				</Modal>

			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	scrollContainer: {
		flex: 1,
	},
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
		height: 180,
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
	},
	sectionContainer: {
		marginTop: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		marginLeft: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	seeAllLink: {
		color: '#F66B0E',
		fontSize: 14,
		fontWeight: '500',
		marginRight: 15,
	},
	contactCardsContainer: {
		flexDirection: 'row',
	},
	contactCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 16,
		marginLeft: 15,
		marginRight: 5,
		width: 160,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	contactName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	contactActions: {
		fontSize: 12,
		color: '#F66B0E',
		fontWeight: '500',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: '90%',
		minHeight: '50%',
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	closeButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: '#F5F5F5',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeButtonText: {
		fontSize: 20,
		color: '#666',
		fontWeight: '300',
	}
})