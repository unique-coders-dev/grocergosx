import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface PlaceholderScreenProps {
  name: string;
  onPress?: () => void;
  buttonText?: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ name, onPress, buttonText }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{name}</Text>
      {onPress && buttonText && (
        <Button mode="contained" onPress={onPress} style={styles.button}>
          {buttonText}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 20,
  },
});
