import React, { useEffect, useState } from 'react';
import VibesReactNativeExpo from 'vibes-react-native-expo';
import { Button, SafeAreaView, ScrollView, Text, View, Alert, TouchableOpacity, RefreshControl } from 'react-native';

export default function App() {
  const [onChangePayload, setOnChangePayload] = useState<any>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [registrationStatus, setRegistrationStatus] = useState<string>('Ready to register');

  useEffect(() => {
    const subscription = (VibesReactNativeExpo as any).addListener('onChange', (payload: any) => {
      setOnChangePayload(payload);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Vibes Push Notifications</Text>
        
        <Group name="Registration Status">
          <Text style={[styles.statusText, {color: registrationStatus.includes('❌') ? 'red' : registrationStatus.includes('✅') ? 'green' : 'orange'}]}>
            {registrationStatus}
          </Text>
        </Group>
        
        <Group name="SDK Build Version">
          <Text style={styles.versionText}>{VibesReactNativeExpo.SDKBuildVersion}</Text>
        </Group>
        
        <Group name="Device Info & Tokens">
          <Text style={styles.infoText}>
            {deviceInfo ? (
              <>
                <Text style={styles.boldText}>Device ID: </Text>
                <Text style={styles.tokenText}>{deviceInfo.device_id || 'Not available'}</Text>
                {'\n\n'}
                <Text style={styles.boldText}>Firebase Push Token: </Text>
                <Text style={styles.tokenText}>{deviceInfo.push_token || 'Not available'}</Text>
              </>
            ) : 'Click "Register Device" first'}
          </Text>
        </Group>
        
        <Group name="Manual Actions">
          <Button
            title="1️⃣ Register Device"
            onPress={async () => {
              try {
                setRegistrationStatus('Registering device...');
                await VibesReactNativeExpo.registerDevice();
                console.log('✅ Device registered successfully');
                setRegistrationStatus('✅ Device registered successfully');
                Alert.alert('Success', 'Device registered successfully');
              } catch (error) {
                console.error('❌ Error registering device:', error);
                setRegistrationStatus('❌ Device registration failed');
                Alert.alert('Error', 'Device registration failed: ' + error);
              }
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="2️⃣ Register Push Notifications"
            onPress={async () => {
              try {
                setRegistrationStatus('Registering push notifications...');
                await VibesReactNativeExpo.registerPush();
                console.log('✅ Push notifications registered successfully');
                setRegistrationStatus('✅ Push notifications registered successfully');
                Alert.alert('Success', 'Push notifications registered successfully');
              } catch (error) {
                console.error('❌ Error registering push:', error);
                setRegistrationStatus('❌ Push registration failed');
                Alert.alert('Error', 'Push registration failed: ' + error);
              }
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="3️⃣ Get Device Info & Tokens"
            onPress={async () => {
              try {
                const info = await VibesReactNativeExpo.getVibesDeviceInfo();
                setDeviceInfo(info);
                console.log('Device info:', info);
                Alert.alert('Device Info', JSON.stringify(info, null, 2));
              } catch (error) {
                Alert.alert('Error', 'Failed to get device info: ' + error);
              }
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="🔄 Do All Steps"
            onPress={async () => {
              try {
                setRegistrationStatus('Step 1/3: Registering device...');
                await VibesReactNativeExpo.registerDevice();
                console.log('✅ Device registered');
                
                setRegistrationStatus('Step 2/3: Registering push...');
                await VibesReactNativeExpo.registerPush();
                console.log('✅ Push registered');
                
                setRegistrationStatus('Step 3/3: Getting device info...');
                const info = await VibesReactNativeExpo.getVibesDeviceInfo();
                setDeviceInfo(info);
                console.log('✅ Device info retrieved');
                
                setRegistrationStatus('🎉 All steps completed successfully!');
                Alert.alert('Success', 'All registration steps completed!\n\nDevice ID: ' + (info.device_id || 'N/A') + '\nPush Token: ' + (info.push_token ? 'Available' : 'N/A'));
              } catch (error) {
                console.error('❌ Error in registration process:', error);
                setRegistrationStatus('❌ Registration failed: ' + error);
                Alert.alert('Error', 'Registration failed: ' + error);
              }
            }}
          />
        </Group>
        
        <Group name="Events">
          <Text>{onChangePayload?.value || 'No events yet'}</Text>
        </Group>
        
        <Group name="Test Functions">
          <Button
            title="Set value"
            onPress={async () => {
              await VibesReactNativeExpo.setValueAsync('Hello from JS!');
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    margin: 20,
    textAlign: 'center' as const,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 15,
    color: '#333',
  },
  group: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  versionText: {
    fontSize: 16,
    textAlign: 'center' as const,
    color: '#666',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  boldText: {
    fontWeight: 'bold' as const,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#0066cc',
    backgroundColor: '#e6f3ff',
    padding: 4,
    borderRadius: 4,
  },
  buttonSpacing: {
    height: 12,
  },
};
