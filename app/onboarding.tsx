import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

type OnboardingSlide = {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  buttonLabel: string;
  image: number;
  variant: "welcome" | "content";
};

const slides: OnboardingSlide[] = [
  {
    id: "growth-for-everyone",
    title: "GROWTH FOR\nEVERYONE",
    description: "INDIVIDUAL SAVING, GROUP\nINVESTING, DEMOCRATIC TRUST",
    buttonLabel: "GET STARTED",
    image: images.innovestIconTree,
    variant: "welcome",
  },
  {
    id: "personal-wealth",
    title: "PERSONAL WEALTH",
    eyebrow: "Save instantly or for fixed terms.\nWatch your personal fund flourish.",
    description: "Save instantly or for fixed terms.\nWatch your personal fund flourish.",
    buttonLabel: "NEXT",
    image: images.onboardingPersonalWealth,
    variant: "content",
  },
  {
    id: "join-the-club",
    title: "JOIN THE CLUB",
    eyebrow: "Pool money with friends, family, or\ncolleagues for bigger investments.",
    description: "Pool money with friends, family, or\ncolleagues for bigger investments.",
    buttonLabel: "DONE",
    image: images.onboardingJoinClub,
    variant: "content",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    if (activeIndex === slides.length - 1) {
      router.replace("/sign-up");
      return;
    }

    const nextIndex = Math.min(activeIndex + 1, slides.length - 1);
    listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(nextIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style={activeIndex === 0 ? "light" : "dark"} />

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index }) => (
          <View style={{ width }} className="flex-1 bg-white">
            {item.variant === "welcome" ? (
              <WelcomeSlide slide={item} width={width} onPress={goNext} />
            ) : (
              <ContentSlide
                slide={item}
                index={index}
                activeIndex={activeIndex}
                total={slides.length}
                width={width}
                onPress={goNext}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function WelcomeSlide({
  slide,
  width,
  onPress,
}: {
  slide: OnboardingSlide;
  width: number;
  onPress: () => void;
}) {
  return (
    <View className="flex-1 bg-white">
      <View className="h-[55%] items-center justify-end bg-primary px-8 pb-6">
        <Image
          source={slide.image}
          resizeMode="contain"
          style={{ width: width * 0.62, height: width * 0.42 }}
        />
        <Text className="mt-1 font-serif text-[44px] leading-[50px] text-white">
          InnoVest
        </Text>
      </View>

      <View className="flex-1 items-center px-8 pt-8">
        <Text className="text-center font-serif text-[28px] leading-[31px] text-[#333333]">
          {slide.title}
        </Text>
        <Text className="mt-4 text-center font-sans-bold text-[11px] leading-[15px] text-[#333333]">
          {slide.description}
        </Text>

        <View className="mt-5 h-[72px] w-[118px]">
          <Image
            source={images.onboardingJoinClub}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <OnboardingButton label={slide.buttonLabel} onPress={onPress} filled />
      </View>
    </View>
  );
}

function ContentSlide({
  slide,
  index,
  activeIndex,
  total,
  width,
  onPress,
}: {
  slide: OnboardingSlide;
  index: number;
  activeIndex: number;
  total: number;
  width: number;
  onPress: () => void;
}) {
  const isLast = index === total - 1;

  return (
    <View className="flex-1 bg-white px-5 pb-5 pt-3">
      <Text className="text-center font-serif text-[28px] leading-[34px] text-[#333333]">
        {slide.title}
      </Text>
      <Text className="mt-1 text-center font-sans-semibold text-[13px] leading-[17px] text-[#333333]">
        {slide.eyebrow}
      </Text>

      <View className="flex-1 items-center justify-center">
        <Image
          source={slide.image}
          resizeMode="contain"
          style={{
            width: width * (isLast ? 0.74 : 0.7),
            height: width * (isLast ? 0.74 : 0.7),
          }}
        />
      </View>

      <Text className="mb-5 px-2 font-sans-semibold text-[13px] leading-[18px] text-[#333333]">
        {slide.description}
      </Text>

      <Pagination activeIndex={activeIndex} total={total} />

      <OnboardingButton label={slide.buttonLabel} onPress={onPress} filled={isLast} />
    </View>
  );
}

function Pagination({ activeIndex, total }: { activeIndex: number; total: number }) {
  return (
    <View className="mb-3 flex-row items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${
            activeIndex === index ? "bg-primary" : "bg-[#D8D6B8]"
          }`}
        />
      ))}
    </View>
  );
}

function OnboardingButton({
  label,
  onPress,
  filled,
}: {
  label: string;
  onPress: () => void;
  filled: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={{
        alignItems: "center",
        alignSelf: "stretch",
        backgroundColor: filled ? "#6B7220" : "#FFFFFF",
        borderColor: "#BEB963",
        borderRadius: 4,
        borderWidth: 1,
        height: 34,
        justifyContent: "center",
      }}
    >
      <Text
        className={`font-sans-bold text-[11px] tracking-[0.5px] ${
          filled ? "text-white" : "text-primary"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
