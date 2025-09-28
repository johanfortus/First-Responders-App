import { Linking, Alert } from 'react-native';

async function sendSMS(number, message = '') {
    const phoneNumber = `sms:${number}${message ? `?body=${encodeURIComponent(message)}` : ''}`;
    try {
        const supported = await Linking.canOpenURL(phoneNumber);

        if (supported){
            await Linking.openURL(phoneNumber);
        } 
        else{
            console.log('SMS is not available or supported on this device.');
        }
    }
    catch (error){
        console.error(error);
    }
};

export default sendSMS;
