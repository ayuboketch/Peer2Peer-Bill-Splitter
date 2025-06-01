import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Displays a "M-PESA STATEMENTS" section with latest transaction and a carousel of slides.
 * Matching the app's dark background and following immediately after the previous section.
 */
export const StatementsSection = ({
  transactions = [],
  slides = [],
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const onSeeAll = () => Alert.alert('See All', 'This feature is empty for now.');
  const latest = transactions[0] || {};

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSlide(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>M-PESA STATEMENTS</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

      {latest.id ? (
        <View style={styles.transactionRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {latest.title.split(' ').map(w => w[0]).join('')}
            </Text>
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{latest.title}</Text>
            <Text style={styles.transactionSubtitle}>{latest.subtitle}</Text>
          </View>
          <View style={styles.transactionAmountCol}>
            <Text style={styles.transactionAmount}>{latest.amount}</Text>
            <Text style={styles.transactionDate}>{latest.date}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noTransaction}>No transactions available.</Text>
      )}

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        ref={scrollRef}
        contentContainerStyle={styles.carouselContainer}
      >
        {slides.map(slide => (
          <View key={slide.id} style={[styles.slide, { width }]}>              
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeSlide === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  seeAll: {
    fontSize: 12,
    color: '#4da6ff',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '500',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionSubtitle: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 6,
  },
  transactionAmountCol: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    color: '#ff4d4d',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDate: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 2,
  },
  noTransaction: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  carouselContainer: {
    // no extra top margin; follows immediately
  },
  slide: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    length: 50,
    // width: 'auto', // Fixed width
    width: 70,
    height: 100, // Reduced height (length)
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Centers in parent container
    marginHorizontal: 'auto', // Web fallback
    padding: 20,
  },
  slideTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  slideSubtitle: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});
