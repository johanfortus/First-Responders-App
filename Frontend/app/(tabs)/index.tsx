import { Text, View, StyleSheet, Image, ScrollView, Modal, TouchableOpacity, SafeAreaView, Animated } from "react-native";
import { Link, useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import makeCall from "../../utils/makeCall";
import sendSMS from "../../utils/sendSMS";
import ImportantNumbers from "../ImportantNumbers";
import ResourcesModal from "../ResourcesModal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Index() {
	const [numbersModalVisible, setNumbersModalVisible] = useState(false);
	const [resourcesModalVisible, setResourcesModalVisible] = useState(false);
	const [isFirstStartup, setIsFirstStartup] = useState(true);
	const [userId, setUserId] = useState('demo_user_123'); // Replace with actual user ID
	const [pollingActive, setPollingActive] = useState(true);
	const router = useRouter();
	
	// Animation values
	const bannerOpacity = useRef(new Animated.Value(0)).current;
	const bannerScale = useRef(new Animated.Value(0.8)).current;
	const textOpacity = useRef(new Animated.Value(0)).current;
	const textTranslateY = useRef(new Animated.Value(20)).current;
	const ambientPulse = useRef(new Animated.Value(1)).current;
	
	// Polling function for chat triggers
	const pollChatTriggers = async () => {
		if (!pollingActive) return; // Stop polling if inactive
		
		try {
			const response = await fetch(`/users/${userId}/chat-triggers`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			
			if (response.ok) {
				const data = await response.json();
				console.log('🔍 Polling chat triggers...', data);
				
				// Check if there are new triggers (DEMO: Always trigger for any severity)
				if (data.triggers && data.triggers.length > 0) {
					const newTriggers = data.triggers.filter(trigger => 
						trigger.isNew && 
						!trigger.acknowledged
					);
					
					if (newTriggers.length > 0) {
						// Sort by timestamp to get the most recent trigger
						const latestTrigger = newTriggers.sort((a, b) => 
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						)[0];
						
						console.log('DEMO MODE: TRIGGER DETECTED!', latestTrigger);
						
						// Stop polling immediately
						setPollingActive(false);
						
						// Navigate to PostCallPause first, then to chat
						router.push({
							pathname: "/(modals)/post-call-pause",
							params: {
								incidentId: latestTrigger.incidentId || latestTrigger.callId,
								severity: latestTrigger.severity.toString(),
								source: 'trigger',
								triggerId: latestTrigger.id
							}
						});
						
						// Mark trigger as acknowledged to prevent duplicate navigation
						// You might want to call an API endpoint here to mark it as seen
					}
				}
			}
		} catch (error) {
			console.error('Error polling chat triggers:', error);
			
			// DEMO MODE: Simulate a trigger after 10 seconds if no real endpoint
			console.log('🔍 No real endpoint - simulating demo trigger after 10 seconds...');
			
			// Create a demo trigger after 10 seconds
			setTimeout(() => {
				if (pollingActive) {
					console.log('🚨 DEMO MODE: Simulated trigger detected!');
					
					// Stop polling immediately
					setPollingActive(false);
					
					// Navigate to PostCallPause with demo data
					router.push({
						pathname: "/(modals)/post-call-pause",
						params: {
							incidentId: 'demo_incident_123',
							severity: '0.85',
							source: 'demo_trigger',
							triggerId: 'demo_trigger_456'
						}
					});
				}
			}, 10000); // 10 seconds delay
		}
	};
	
	// Function to acknowledge a trigger (mark as seen)
	const acknowledgeTrigger = async (triggerId: string) => {
		try {
			await fetch(`/users/${userId}/chat-triggers/${triggerId}/acknowledge`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Add authentication headers if needed
					// 'Authorization': `Bearer ${authToken}`,
				},
			});
		} catch (error) {
			console.error('Error acknowledging trigger:', error);
		}
	};
	
	useEffect(() => {
		// Check if this is first startup (you could use AsyncStorage for persistence)
		const hasSeenStartup = false; // Replace with actual check
		setIsFirstStartup(!hasSeenStartup);
		
		if (!hasSeenStartup) {
			// Startup animation sequence
			Animated.sequence([
				// Banner entrance
				Animated.parallel([
					Animated.timing(bannerOpacity, {
						toValue: 1,
						duration: 800,
						useNativeDriver: true,
					}),
					Animated.spring(bannerScale, {
						toValue: 1,
						tension: 100,
						friction: 8,
						useNativeDriver: true,
					}),
				]),
				// Text appearance
				Animated.parallel([
					Animated.timing(textOpacity, {
						toValue: 1,
						duration: 600,
						useNativeDriver: true,
					}),
					Animated.timing(textTranslateY, {
						toValue: 0,
						duration: 600,
						useNativeDriver: true,
					}),
				]),
			]).start();
			
			// Set flag that user has seen startup
			// AsyncStorage.setItem('hasSeenStartup', 'true');
		} else {
			// Regular entrance for returning users
			bannerOpacity.setValue(1);
			bannerScale.setValue(1);
			textOpacity.setValue(1);
			textTranslateY.setValue(0);
		}
		
		// Ambient pulse animation
		const createAmbientPulse = () => {
			Animated.sequence([
				Animated.timing(ambientPulse, {
					toValue: 1.05,
					duration: 3000,
					useNativeDriver: true,
				}),
				Animated.timing(ambientPulse, {
					toValue: 1,
					duration: 3000,
					useNativeDriver: true,
				}),
			]).start(() => createAmbientPulse());
		};
		
		createAmbientPulse();
	}, []);
	
	// Demo trigger effect - simpler approach
	useEffect(() => {
		// DEMO: Trigger after 10 seconds automatically
		const demoTrigger = setTimeout(() => {
			if (pollingActive) {
				console.log('🚨 DEMO: Auto-triggering PostCallPause after 10 seconds');
				setPollingActive(false);
				
				// Try different navigation approaches
				console.log('Attempting navigation to PostCallPause...');
				
				router.push({
					pathname: "/(modals)/post-call-pause",
					params: {
						incidentId: 'demo_incident_123',
						severity: '0.85',
						source: 'demo_auto_trigger'
					}
				}).catch((error) => {
					console.error('Navigation error:', error);
					// Fallback: try direct route
					router.push('/post-call-pause?incidentId=demo_incident_123&severity=0.85&source=demo_auto_trigger');
				});
			}
		}, 10000); // 10 seconds
		
		// Also try the real polling for backup
		pollChatTriggers();
		const pollingInterval = setInterval(pollChatTriggers, 10000);
		
		return () => {
			clearTimeout(demoTrigger);
			clearInterval(pollingInterval);
		};
	}, [userId, pollingActive]);
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView 
				style={styles.scrollContainer} 
				contentContainerStyle={styles.scrollContentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.headerContainer}>
					<Text style={styles.homeHeader}>Home</Text>
					{pollingActive && (
						<View style={styles.pollingIndicator}>
							<View style={styles.pollingDot} />
							<Text style={styles.pollingText}>Monitoring</Text>
						</View>
					)}
				</View>
				<Animated.View 
					style={[
						styles.homeBanner,
						{
							opacity: bannerOpacity,
							transform: [
								{ scale: bannerScale },
								{ scale: ambientPulse }
							]
						}
					]}
				>
					<Animated.View 
						style={[
							styles.bannerTextContainer,
							{
								opacity: textOpacity,
								transform: [{ translateY: textTranslateY }]
							}
						]}
					>
						<Text style={styles.bannerHeader}>
							{isFirstStartup ? "Welcome to ACE" : "Welcome Back Name"}
						</Text>
						<Text style={styles.bannerSubHeader}>
							{isFirstStartup ? "Supporting first responders" : "We're here for you"}
						</Text>
					</Animated.View>
					<Image source={require('../../assets/images/stroke.png')} style={styles.strokeGraphic}/>
				</Animated.View>

				{/* Test PostCallPause */}
				<TouchableOpacity 
					style={styles.testButton}
					onPress={() => {
						console.log('🧪 Test button pressed - navigating to PostCallPause');
						router.push("/(modals)/post-call-pause?incidentId=inc_123&severity=0.82");
					}}
				>
					<Text style={styles.testButtonText}>Test Post-Call Pause</Text>
				</TouchableOpacity>

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
									<Ionicons name="people-outline" size={20} color="white" />
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
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 28,
		marginLeft: 20,
		marginRight: 20,
	},
	homeHeader: {
		fontSize: 24,
		fontWeight: '600',
	},
	pollingIndicator: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F66B0E',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	pollingDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00FF00',
		marginRight: 6,
	},
	pollingText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	homeBanner: {
		justifyContent: "flex-start",
		alignItems: "flex-end",
		alignSelf: "flex-start",
		height: 180,
		width: "100%",
		marginTop: 14,		
		backgroundColor: "#F66B0E",
		shadowColor: "#F66B0E",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 12,
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
	},
	testButton: {
		backgroundColor: '#F66B0E',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
		marginHorizontal: 20,
		marginBottom: 20,
		alignItems: 'center',
	},
	testButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	}
})