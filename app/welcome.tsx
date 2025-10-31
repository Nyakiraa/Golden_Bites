import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    'ChunkoBoldDemo': require('@/assets/fonts/ChunkoBoldDemo.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobTopRight} />
      <View style={styles.blobMidLeft} />

      {/* Logo */}
      <Image
        source={require('@/assets/images/gb_logo.png')}
        style={styles.logo}
        contentFit="contain"
      />

       {/* Yellow card with wavy top */}
       <View style={styles.yellowCard}>
         <View style={styles.wavyTop} />
         
         <View style={styles.cardContent}>
          <Text style={styles.welcomeTitle}>WELCOME</Text>
          
          <Text style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => router.push('/signin')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const YELLOW_LIGHT = '#F8DF86';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    width: 180,
    height: 180,
    zIndex: 2,
  },
  blobTopLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: YELLOW_LIGHT,
  },
  blobTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: YELLOW_LIGHT,
  },
  blobMidLeft: {
    position: 'absolute',
    top: 200,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: YELLOW_LIGHT,
  },
  
  yellowCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: YELLOW_LIGHT,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  wavyTop: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: YELLOW_LIGHT,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'ChunkoBoldDemo',
    color: '#000000',
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  signInButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButton: {
    flex: 1,
    backgroundColor: YELLOW_LIGHT,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
