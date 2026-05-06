import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Text, Card, ProgressBar, List, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../config/theme';

const { width } = Dimensions.get('window');

export const LoyaltyScreen = ({ navigation }: any) => {
  const userUid = auth().currentUser?.uid;

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer-loyalty', userUid],
    queryFn: async () => {
      if (!userUid) return null;
      const doc = await firestore().collection('users').doc(userUid).get();
      return doc.data();
    },
    enabled: !!userUid,
  });

  const points = customer?.loyaltyPoints || 0;
  
  const getTier = (pts: number) => {
    if (pts >= 500) return { name: 'Gold', color: '#FFD700', next: null };
    if (pts >= 100) return { name: 'Silver', color: '#C0C0C0', next: 500 };
    return { name: 'Bronze', color: '#CD7F32', next: 100 };
  };

  const tier = getTier(points);
  const nextTierPoints = tier.next || 0;
  const progress = nextTierPoints > 0 ? points / nextTierPoints : 1;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>Loyalty Rewards</Text>
        </View>

        <Card style={styles.pointsCard}>
          <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
            <Text style={styles.tierText}>{tier.name}</Text>
          </View>
          <Card.Content style={styles.pointsContent}>
            <Text variant="displayMedium" style={styles.pointsValue}>{points}</Text>
            <Text variant="titleMedium" style={styles.pointsLabel}>Available Points</Text>
            
            {tier.next !== null && (
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text variant="bodySmall">{(tier.next as number) - points} points to {tier.next === 500 ? 'Gold' : 'Silver'}</Text>
                  <Text variant="bodySmall">{Math.round(progress * 100)}%</Text>
                </View>
                <ProgressBar progress={progress} color={tier.color} style={styles.progressBar} />
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.referralBox}>
          <View style={styles.referralText}>
            <Text variant="titleMedium">Refer a Friend</Text>
            <Text variant="bodySmall">Earn 50 points for every friend who joins!</Text>
          </View>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('ReferFriends')}
            style={styles.referButton}
          >
            Invite
          </Button>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>How to Earn Points</Text>
        <View style={styles.earningGrid}>
          <Card style={styles.earnCard}>
            <Card.Content style={styles.earnContent}>
              <MaterialCommunityIcons name="cart" size={24} color={colors.primary} />
              <Text variant="titleSmall">Grocery</Text>
              <Text variant="bodySmall">1pt/$1</Text>
            </Card.Content>
          </Card>
          <Card style={styles.earnCard}>
            <Card.Content style={styles.earnContent}>
              <MaterialCommunityIcons name="washing-machine" size={24} color={colors.primary} />
              <Text variant="titleSmall">Laundry</Text>
              <Text variant="bodySmall">2pts/order</Text>
            </Card.Content>
          </Card>
          <Card style={styles.earnCard}>
            <Card.Content style={styles.earnContent}>
              <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
              <Text variant="titleSmall">Referral</Text>
              <Text variant="bodySmall">50pts total</Text>
            </Card.Content>
          </Card>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Points History</Text>
        <Card style={styles.historyCard}>
          <List.Item
            title="Referral Reward"
            description="May 05, 2026"
            left={props => <List.Icon {...props} icon="plus-circle" color={colors.success} />}
            right={props => <Text {...props} style={[props.style, styles.historyPoints]}>+50</Text>}
          />
          <Divider />
          <List.Item
            title="Grocery Order #5542"
            description="May 04, 2026"
            left={props => <List.Icon {...props} icon="plus-circle" color={colors.success} />}
            right={props => <Text {...props} style={[props.style, styles.historyPoints]}>+45</Text>}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pointsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tierBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomLeftRadius: 20,
    zIndex: 1,
  },
  tierText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  pointsContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  pointsValue: {
    fontWeight: '800',
    color: colors.primary,
  },
  pointsLabel: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  referralBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EB141410',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EB141430',
    marginBottom: 24,
  },
  referralText: {
    flex: 1,
  },
  referButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 15,
  },
  earningGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  earnCard: {
    width: (width - 60) / 3,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  earnContent: {
    alignItems: 'center',
    padding: 10,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 40,
  },
  historyPoints: {
    alignSelf: 'center',
    fontWeight: '700',
    color: colors.success,
    fontSize: 16,
    marginRight: 10,
  },
});
