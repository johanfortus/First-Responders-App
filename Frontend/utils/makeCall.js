import { Linking, Alert } from 'react-native';

async function makeCall(number) {
    const phoneNumber = `tel:${number}`;
    try {
        const supported = await Linking.canOpenURL(phoneNumber);

        if (supported) {
            await Linking.openURL(phoneNumber);
        } 
        else {
            console.log("Phone number not available")
        }
    }
    catch (error) {
        console.error(error);
    }
};

export default makeCall;