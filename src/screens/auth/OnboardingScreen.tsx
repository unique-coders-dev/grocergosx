import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors } from '../../config/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Grocery Shopping',
    description: 'Deliver essentials to your Airbnb, villa, or hotel with ease.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500',
    color: '#FFF5F5',
  },
  {
    id: '2',
    title: 'Laundry Services',
    description: 'Schedule a pickup for same-day or next-day wash & return.',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80&w=500',
    color: '#F5F9FF',
  },
  {
    id: '3',
    title: 'Parcel Delivery',
    description: 'Reliable island-wide parcel pickup and drop-off.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500',
    color: '#F9F5FF',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < SLIDES.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    const lastSlideIndex = SLIDES.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Slide = ({ item }: { item: any }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.color }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text variant="headlineLarge" style={styles.title}>
            {item.title}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        data={SLIDES}
        contentContainerStyle={{ height: height * 0.75 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} />}
      />

      <View style={styles.footer}>
        {/* Pagination Indicator */}
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentSlideIndex === SLIDES.length - 1 ? (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.getStartedButton}
              labelStyle={styles.buttonLabel}
            >
              Get Started
            </Button>
          ) : (
            <View style={styles.row}>
              <TouchableOpacity onPress={skip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button
                mode="contained"
                onPress={goToNextSlide}
                style={styles.nextButton}
              >
                Next
              </Button>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  description: {
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    height: height * 0.25,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  nextButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    width: 120,
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
