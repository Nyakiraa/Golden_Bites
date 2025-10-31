import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const [fontsLoaded] = useFonts({
    'ChunkoBoldDemo': require('@/assets/fonts/ChunkoBoldDemo.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Yellow top section */}
        <View style={styles.yellowSection}>
          <View style={styles.blobTopRight} />
          <View style={styles.blobTopRight2} />
          
          <View style={styles.yellowContent}>
          <Text style={styles.signInTitle}>Sign in</Text>
          <Text style={styles.signInSubtitle}>Please sign in first to enjoy the service.</Text>
        </View>
        
        <View style={styles.curveBottom} />
      </View>

      {/* White form section */}
      <View style={styles.whiteSection}>
        <View style={styles.formContainer}>
          <Text style={styles.emailLabel}>Email</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="school ID"
              placeholderTextColor="#999"
            />
             <View style={styles.personIcon}>
               <Image
                 source={require('@/assets/images/user.png')}
                 style={styles.userIcon}
                 resizeMode="contain"
               />
             </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View style={styles.checkboxRow}>
            <TouchableOpacity style={styles.checkbox}>
              <View style={styles.checkboxInner}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Not a member? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.registerLink}>Register now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.separatorLine} />
          </View>

           <TouchableOpacity style={styles.googleButton}>
             <View style={styles.googleIcon}>
               <Image
                 source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                 style={styles.googleLogoImage}
                 resizeMode="contain"
               />
             </View>
             <Text style={styles.googleText}>Continue with ADNU GBOX</Text>
           </TouchableOpacity>
        </View>
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
    height: '35%',
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
  signInTitle: {
    fontSize: 36,
    fontFamily: 'ChunkoBoldDemo',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  signInSubtitle: {
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  emailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: YELLOW_DARK,
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
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
  personIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  userIcon: {
    width: 18,
    height: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: YELLOW_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    color: YELLOW_DARK,
    flex: 1,
  },
  forgotPassword: {
    marginLeft: 'auto',
  },
  forgotText: {
    fontSize: 14,
    color: YELLOW_DARK,
  },
  loginButton: {
    backgroundColor: YELLOW_DARK,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleLogoImage: {
    width: 20,
    height: 20,
  },
  googleText: {
    fontSize: 16,
    color: '#000000',
  },
});
