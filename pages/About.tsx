import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MenuButton from "@/components/UI/PageHeader/MenuButton";
import { useDrawer } from "@/context/DrawerContext";
import FastImageWLoader from "@/components/FastImageWLoader";
import colors from "@/constants/colors";

const About = () => {
    const insets = useSafeAreaInsets();
    const { toggleDrawer } = useDrawer();

    const aboutItems = [
        {
            title: "Rich Cultural Heritage",
            description:
                "Bodoland is home to the vibrant Bodo culture, one of the most significant indigenous communities of Northeast India. The region showcases traditional dance forms, music, and art that have been preserved for generations.",
        },
        {
            title: "Breathtaking Natural Beauty",
            description:
                "From lush green forests to serene rivers, Bodoland offers pristine natural landscapes that captivate visitors with their untouched beauty and diverse wildlife.",
        },
        {
            title: "Unique Biodiversity",
            description:
                "The region is blessed with rich flora and fauna, including rare species found in its national parks and wildlife sanctuaries, making it a paradise for nature lovers and wildlife enthusiasts.",
        },
        {
            title: "Traditional Festivals",
            description:
                "Experience the colorful festivals of Bodoland, where traditional customs come alive through vibrant celebrations, folk dances, and community gatherings.",
        },
        {
            title: "Authentic Cuisine",
            description:
                "Savor the unique flavors of Bodo cuisine, featuring organic ingredients, traditional cooking methods, and dishes that reflect the community's close connection with nature.",
        },
    ];

    return (
        <View style={styles.container}>
            {/* Floating Menu Button - Independent of scroll content */}
            <View style={[styles.floatingMenuButton, { top: insets.top + 10 }]}>
                <MenuButton onPress={toggleDrawer} size={28} color="white" />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pageContent}>
                    <View style={styles.heroSection}>
                        <FastImageWLoader
                            source={{
                                uri: "https://picsum.photos/512/512?random=1",
                            }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <View style={styles.heroOverlay}>
                            <Text style={styles.heroTitle}>
                                Welcome to Bodoland
                            </Text>
                            <Text style={styles.heroSubtitle}>
                                Discover the Beauty of Northeast India
                            </Text>
                        </View>
                    </View>
                    {/* Introduction */}
                    <View style={styles.section}>
                        <Text style={styles.mainDescription}>
                            Bodoland Territorial Region (BTR) is a picturesque
                            autonomous region in Assam, Northeast India, known
                            for its rich cultural heritage, stunning natural
                            beauty, and warm hospitality. Spanning across four
                            districts - Kokrajhar, Chirang, Baksa, and Udalguri
                            - this enchanting land offers visitors an authentic
                            experience of indigenous culture blended with
                            breathtaking landscapes.
                        </Text>
                    </View>

                    {/* Flash List Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What Makes Bodoland Special
                        </Text>
                        {aboutItems.map((item, index) => (
                            <View key={index} style={styles.flashItem}>
                                <View style={styles.bullet} />
                                <View style={styles.flashContent}>
                                    <Text style={styles.flashTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.flashDescription}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Blog-style Content with Images */}

                    {/* Section 1 - Culture */}
                    <View style={styles.blogSection}>
                        <Text style={styles.blogSectionTitle}>
                            Cultural Richness
                        </Text>
                        <View style={styles.blogContent}>
                            <FastImageWLoader
                                source={{
                                    uri: "https://picsum.photos/512/512?random=1",
                                }}
                                style={styles.blogImageLeft}
                            />
                            <View style={styles.blogTextRight}>
                                <Text style={styles.blogText}>
                                    The Bodo people are known for their rich
                                    cultural traditions that have been passed
                                    down through generations. Their traditional
                                    attire, intricate handloom products, and
                                    folk art reflect a deep connection with
                                    nature and spirituality. The region's
                                    cultural landscape is adorned with
                                    traditional houses, community halls, and
                                    sacred groves that tell stories of ancient
                                    wisdom.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 2 - Nature */}
                    <View style={styles.blogSection}>
                        <Text style={styles.blogSectionTitle}>
                            Natural Wonders
                        </Text>
                        <View style={styles.blogContent}>
                            <View style={styles.blogTextLeft}>
                                <Text style={styles.blogText}>
                                    Bodoland's landscape is a tapestry of
                                    rolling hills, dense forests, and meandering
                                    rivers. The region is home to several
                                    wildlife sanctuaries and national parks,
                                    including the famous Manas National Park, a
                                    UNESCO World Heritage Site. Visitors can
                                    witness elephants, tigers, rhinoceros, and
                                    numerous bird species in their natural
                                    habitat.
                                </Text>
                            </View>
                            <FastImageWLoader
                                source={{
                                    uri: "https://picsum.photos/512/512?random=2",
                                }}
                                style={styles.blogImageRight}
                            />
                        </View>
                    </View>

                    {/* Section 3 - Adventure */}
                    <View style={styles.blogSection}>
                        <Text style={styles.blogSectionTitle}>
                            Adventure & Exploration
                        </Text>
                        <View style={styles.blogContent}>
                            <FastImageWLoader
                                source={{
                                    uri: "https://picsum.photos/512/512?random=3",
                                }}
                                style={styles.blogImageLeft}
                            />
                            <View style={styles.blogTextRight}>
                                <Text style={styles.blogText}>
                                    For adventure enthusiasts, Bodoland offers
                                    numerous opportunities for trekking, river
                                    rafting, and wildlife photography. The
                                    region's pristine forests and hills provide
                                    perfect settings for eco-tourism activities.
                                    Visitors can explore ancient temples,
                                    participate in village tourism programs, and
                                    experience the authentic rural lifestyle.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section 4 - Hospitality */}
                    <View style={styles.blogSection}>
                        <Text style={styles.blogSectionTitle}>
                            Warm Hospitality
                        </Text>
                        <View style={styles.blogContent}>
                            <View style={styles.blogTextLeft}>
                                <Text style={styles.blogText}>
                                    The people of Bodoland are known for their
                                    warm hospitality and welcoming nature.
                                    Visitors are treated as honored guests and
                                    are often invited to participate in local
                                    festivals and celebrations. This genuine
                                    warmth creates lasting memories and
                                    connections that go beyond typical tourist
                                    experiences.
                                </Text>
                            </View>
                            <FastImageWLoader
                                source={{
                                    uri: "https://picsum.photos/512/512?random=4",
                                }}
                                style={styles.blogImageRight}
                            />
                        </View>
                    </View>

                    {/* Closing Section */}
                    <View style={styles.closingSection}>
                        <Text style={styles.closingTitle}>
                            Visit Bodoland Today
                        </Text>
                        <Text style={styles.closingText}>
                            Embark on a journey to discover the hidden gems of
                            Northeast India. Bodoland awaits you with its
                            untouched beauty, rich culture, and unforgettable
                            experiences that will leave you with memories to
                            cherish for a lifetime.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default About;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flex: 1,
    },
    pageContent: {
        paddingBottom: 30,
    },

    // Hero Section - Full Screen
    heroSection: {
        position: "relative",
        height: 450, // Increased height for full screen effect
        marginBottom: 0,
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        opacity: 0.9,
    },

    // Floating Menu Button
    floatingMenuButton: {
        position: "absolute",
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // High z-index to ensure it's always on top
        elevation: 10, // For Android shadow
    },

    // Sections
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
        marginTop: 25, // Add top margin for first section after hero
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
        textAlign: "center",
    },
    mainDescription: {
        fontSize: 16,
        color: "#E5E5E7",
        lineHeight: 24,
        textAlign: "justify",
    },

    // Flash List Items
    flashItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 20,
        borderRadius: 10,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.secondary,
        marginTop: 8,
        marginRight: 15,
    },
    flashContent: {
        flex: 1,
    },
    flashTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        marginBottom: 8,
    },
    flashDescription: {
        fontSize: 14,
        color: "#B0B0B3",
        lineHeight: 20,
        textAlign: "justify",
    },

    // Blog Sections
    blogSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    blogSectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
        textAlign: "center",
    },
    blogContent: {
        flexDirection: "row",
        alignItems: "flex-start",
        minHeight: 100,
    },

    // Left Image Layout
    blogImageLeft: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
    },
    blogTextRight: {
        flex: 1,
        justifyContent: "center",
    },

    // Right Image Layout
    blogImageRight: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginLeft: 15,
    },
    blogTextLeft: {
        flex: 1,
        justifyContent: "center",
    },

    blogText: {
        fontSize: 14,
        color: "#D1D1D6",
        lineHeight: 20,
        textAlign: "justify",
    },

    // Closing Section
    closingSection: {
        paddingHorizontal: 20,
        marginTop: 10,
        paddingVertical: 25,
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        marginHorizontal: 20,
        borderRadius: 10,
    },
    closingTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.secondary,
        textAlign: "center",
        marginBottom: 15,
    },
    closingText: {
        fontSize: 16,
        color: "#E5E5E7",
        lineHeight: 24,
        textAlign: "center",
    },
});
