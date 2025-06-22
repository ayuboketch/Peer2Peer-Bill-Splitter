import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Welcome to MSplit",
    description: "Effortlessly manage group payments and shared expenses.",
    image: require("../../../assets/MSplit-illustration1.png"),
  },
  {
    title: "Split Bills Easily",
    description: "Select a bill, add members, and divide the cost instantly.",
    image: require("../../../assets/MSplit-illustration2.png"),
  },
  {
    title: "Track Payments",
    description: "Get real-time updates on who has paid and who hasn’t.",
    image: require("../../../assets/MSplit-illustration3.png"),
  },
  {
    title: "Powerful Features",
    description:
      "Smart reminders, expense insights, and group chat to keep everyone in sync.",
    image: require("../../../assets/MSplit-illustration4.png"),
  },
];

const LandingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      onComplete(); // Go to Dashboard
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View style={styles.slide} key={index}>
            <Image source={slide.image} style={styles.image} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.pageNumber}>{`${currentIndex + 1}/${slides.length}`}</Text>
        <TouchableOpacity style={styles.button} onPress={nextSlide}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Go to Dashboard" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: 40,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#10B981",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pageNumber: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
});
