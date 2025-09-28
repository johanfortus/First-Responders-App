import { Text, View, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import makeCall from "../../utils/makeCall";
import sendSMS from "../../utils/sendSMS";
import ImportantNumbers from "../ImportantNumbers";
import ResourcesModal from "../ResourcesModal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
	const [numbersModalVisible, setNumbersModalVisible] = useState(false);
	const [resourcesModalVisible, setResourcesModalVisible] = useState(false);
	const router = useRouter();
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView 
				style={styles.scrollContainer} 
				contentContainerStyle={styles.scrollContentContainer}
				showsVerticalScrollIndicator={false}
			>
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
						<Text style={styles.sectionTitle}>Quick Actions</Text>
						<TouchableOpacity onPress={() => setResourcesModalVisible(true)}>
							<Text style={styles.seeAllLink}>See All</Text>
						</TouchableOpacity>
					</View>
					
					<View style={styles.resourceCardsContainer}>
						<TouchableOpacity 
							style={styles.resourceCard}
							onPress={() => router.push('/resource_1')}
						>
							<View style={styles.resourceCardContent}>
								<View style={styles.resourceTextContainer}>
									<Text style={styles.resourceCardTitle}>Taking Care of You</Text>
									<Text style={styles.resourceCardDescription}>Prioritize these strategies for self-care</Text>
								</View>
								<View style={styles.resourceIcon}>
									<Ionicons name="heart-outline" size={20} color="white" />
								</View>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={styles.resourceCard}
							onPress={() => router.push('/resource_2')}
						>
							<View style={styles.resourceCardContent}>
								<View style={styles.resourceTextContainer}>
									<Text style={styles.resourceCardTitle}>The Power of Family & Connection</Text>
									<Text style={styles.resourceCardDescription}>Importance of social connection in mental health</Text>
								</View>
								<View style={styles.resourceIcon}>
									<Ionicons name="people-outline" size={20} color="white" />
								</View>
							</View>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={styles.resourceCard}
							onPress={() => router.push('/resource_3')}
						>
							<View style={styles.resourceCardContent}>
								<View style={styles.resourceTextContainer}>
									<Text style={styles.resourceCardTitle}>Approaching a Member in Need</Text>
									<Text style={styles.resourceCardDescription}>Demonstrates a peer support approach</Text>
								</View>
								<View style={styles.resourceIcon}>
									<Ionicons name="handshake-outline" size={20} color="white" />
								</View>
							</View>
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
		backgroundColor: '#EFEFEF',
	},
	scrollContainer: {
		flex: 1,
	},
	scrollContentContainer: {
		paddingBottom: 80,
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
		width: "100%",
		marginTop: 14,		
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
		fontSize: 20,
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
	importantNumbersSection: {
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
	},
	sectionContainer: {
		marginTop: 24,
	},
	resourceCardsContainer: {
		marginLeft: 15,
		marginRight: 15,
	},
	resourceCard: {
		backgroundColor: 'white',
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	resourceCardContent: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
	},
	resourceTextContainer: {
		flex: 1,
		marginRight: 12,
	},
	resourceCardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
		marginBottom: 4,
	},
	resourceCardDescription: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
	},
	resourceIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: '#F66B0E',
		justifyContent: 'center',
		alignItems: 'center',
	}
})