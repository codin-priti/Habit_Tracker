import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const requestPermission = async () => {
    if (Device.isDevice) {
        const {status} = await Notifications.requestPermissionsAsync();
        console.log('Notification permission status:', status);
        if (status !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
    }
};

