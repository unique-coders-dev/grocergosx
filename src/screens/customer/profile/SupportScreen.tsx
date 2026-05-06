import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Text, List, Button, IconButton, Card, Divider } from 'react-native-paper';
import { colors } from '../../../config/theme';

export const SupportScreen = ({ navigation }: any) => {
  const handleCall = () => Linking.openURL('tel:+590690779119');
  const handleWhatsApp = () => Linking.openURL('whatsapp://send?phone=590690779119');
  const handleEmail = () => Linking.openURL('mailto:support@grocergosx.com');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="titleLarge">Support & FAQ</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contactSection}>
          <Text variant="headlineSmall" style={styles.title}>How can we help?</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Our team is available island-wide to assist you.
          </Text>

          <View style={styles.buttonGrid}>
            <Button 
              mode="contained" 
              icon="phone" 
              onPress={handleCall} 
              style={[styles.contactButton, { backgroundColor: colors.primary }]}
            >
              Call
            </Button>
            <Button 
              mode="contained" 
              icon="whatsapp" 
              onPress={handleWhatsApp} 
              style={[styles.contactButton, { backgroundColor: '#25D366' }]}
            >
              WhatsApp
            </Button>
          </View>
          <Button 
            mode="outlined" 
            icon="email-outline" 
            onPress={handleEmail} 
            style={styles.emailButton}
            textColor={colors.textPrimary}
          >
            Email Support
          </Button>
        </View>

        <View style={styles.faqSection}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <List.AccordionGroup>
            <List.Accordion title="What are your delivery hours?" id="1" left={props => <List.Icon {...props} icon="clock-outline" />}>
              <List.Item titleNumberOfLines={5} title="We deliver 7 days a week from 8:00 AM to 8:00 PM. Same-day delivery is available for orders placed before 2:00 PM." />
            </List.Accordion>
            <Divider />
            <List.Accordion title="Is there a minimum order?" id="2" left={props => <List.Icon {...props} icon="currency-usd" />}>
              <List.Item titleNumberOfLines={5} title="Grocery orders have no minimum. Laundry service has a 10 lbs minimum order." />
            </List.Accordion>
            <Divider />
            <List.Accordion title="How do I earn loyalty points?" id="3" left={props => <List.Icon {...props} icon="star-outline" />}>
              <List.Item titleNumberOfLines={5} title="You earn 1pt per $1 on groceries, 2pts per laundry order, and 50pts for each friend you refer!" />
            </List.Accordion>
            <Divider />
            <List.Accordion title="Do you deliver to villas?" id="4" left={props => <List.Icon {...props} icon="home-outline" />}>
              <List.Item titleNumberOfLines={5} title="Yes, we deliver to all Airbnbs, villas, and hotels across St. Maarten / St. Martin." />
            </List.Accordion>
          </List.AccordionGroup>
        </View>

        <Card style={styles.preArrivalCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.preTitle}>Coming to St. Maarten?</Text>
            <Text variant="bodySmall">Book our Pre-Arrival Stocking service to have your fridge full before you land.</Text>
            <Button mode="text" onPress={() => navigation.navigate('PreArrival')} textColor={colors.primary}>Learn More</Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  contactSection: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  contactButton: {
    flex: 1,
    borderRadius: 12,
  },
  emailButton: {
    width: '100%',
    borderRadius: 12,
    borderColor: colors.border,
  },
  faqSection: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 15,
  },
  preArrivalCard: {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 0,
  },
  preTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
});
