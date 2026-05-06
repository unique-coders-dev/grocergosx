import React from 'react';
import { View, StyleSheet, SafeAreaView, Share, Image } from 'react-native';
import { Text, Button, Card, IconButton } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { colors } from '../../../config/theme';

export const ReferFriendsScreen = ({ navigation }: any) => {
  const userUid = auth().currentUser?.uid;

  const { data: customer } = useQuery({
    queryKey: ['customer-referral', userUid],
    queryFn: async () => {
      const doc = await firestore().collection('users').doc(userUid).get();
      return doc.data();
    },
  });

  const referralCode = customer?.referralCode || 'GROCERGO50';

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join me on GrocerGo SXM and get $10 off your first grocery order! Use my referral code: ${referralCode}. Download here: https://grocergosx.com`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Refer Friends</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600' }}
          style={styles.image}
        />
        
        <Text variant="headlineMedium" style={styles.title}>Give $10, Get 50pts</Text>
        <Text variant="bodyLarge" style={styles.description}>
          Share your code with friends. When they place their first grocery order, they'll get $10 off and you'll earn 50 loyalty points!
        </Text>

        <Card style={styles.codeCard}>
          <Text variant="bodySmall" style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <View style={styles.codeRow}>
            <Text variant="headlineSmall" style={styles.codeText}>{referralCode}</Text>
            <IconButton icon="content-copy" onPress={() => {}} />
          </View>
        </Card>

        <Button 
          mode="contained" 
          onPress={onShare} 
          style={styles.shareButton}
          contentStyle={styles.buttonContent}
        >
          Share with Friends
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    borderRadius: 100,
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 40,
  },
  codeCard: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    marginBottom: 40,
  },
  codeLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  shareButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 56,
  },
});
