import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const [fontsLoaded] = useFonts({
    'ChunkoBoldDemo': require('@/assets/fonts/ChunkoBoldDemo.ttf'),
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim() || null,
          },
        },
      });

      if (error) {
        // Handle email signups disabled error
        if (error.message.includes('email signups are disabled') || 
            error.message.includes('Email signups are disabled') ||
            error.message.includes('Signups not allowed')) {
          Alert.alert(
            'Sign Up Disabled',
            'Email signups are currently disabled. Please contact support or enable email signups in Supabase settings.',
            [
              {
                text: 'OK',
                style: 'default',
              },
            ]
          );
        } else {
          Alert.alert('Sign Up Failed', error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/signin'),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Yellow top section */}
      <View style={styles.yellowSection}>
        <View style={styles.blobTopRight} />
        <View style={styles.blobTopRight2} />
        
        <View style={styles.yellowContent}>
          <Text style={styles.signUpTitle}>Sign Up</Text>
          <Text style={styles.signUpSubtitle}>Create an account to get started</Text>
        </View>
        
        <View style={styles.curveBottom} />
      </View>

      {/* White form section */}
      <View style={styles.whiteSection}>
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

           <View style={styles.inputGroup}>
             <Text style={styles.inputLabel}>Email address</Text>
             <TextInput
               style={styles.inputField}
               placeholder="123@gmail.com"
               placeholderTextColor="#999"
               keyboardType="email-address"
               autoCapitalize="none"
               value={email}
               onChangeText={setEmail}
               editable={!loading}
             />
           </View>

           <View style={styles.inputGroup}>
             <Text style={styles.inputLabel}>Password</Text>
             <TextInput
               style={styles.inputField}
               placeholder="Password"
               placeholderTextColor="#999"
               secureTextEntry
               value={password}
               onChangeText={setPassword}
               editable={!loading}
             />
           </View>

           <View style={styles.inputGroup}>
             <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇵🇭</Text>
                <Text style={styles.countryCodeText}>+63</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.termsRow}>
            <TouchableOpacity style={styles.termsCheckbox}>
              <View style={styles.checkboxSquare} />
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>I&apos;ve read and agree with the </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.termsText}> and the </Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Privacy Policy.</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.signUpButton, loading && styles.signUpButtonDisabled]} 
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an Account? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
           </View>
         </ScrollView>
       </View>
     </View>
   );
}

const YELLOW_LIGHT = '#F8DF86';
const YELLOW_DARK = '#F2BC2B';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  yellowSection: {
    backgroundColor: YELLOW_DARK,
    height: '30%',
    position: 'relative',
  },
  blobTopRight: {
    position: 'absolute',
    top: -20,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: YELLOW_LIGHT,
    opacity: 0.7,
  },
  blobTopRight2: {
    position: 'absolute',
    top: '50%',
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: YELLOW_LIGHT,
    opacity: 0.5,
    transform: [{ translateY: -40 }],
  },
  yellowContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  signUpTitle: {
    fontSize: 36,
    fontFamily: 'ChunkoBoldDemo',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  signUpSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  curveBottom: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: YELLOW_DARK,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: YELLOW_DARK,
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  flag: {
    fontSize: 16,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 5,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  phoneDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  termsCheckbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxSquare: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  termsLink: {
    fontSize: 12,
    color: '#007AFF',
    textDecorationLine: 'underline',
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
