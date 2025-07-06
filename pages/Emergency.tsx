import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    FlatList,
    ScrollView,
} from "react-native";
import React from "react";
import { useDrawer } from "@/context/DrawerContext";
import MenuButton from "@/components/UI/MenuButton";
import { EmergencyContact, emergencyData, universalEmergencyNumbers, UniversalEmergencyService } from "@/data/emergency_data";
import EmergencyCard from "@/components/EmergencyCard";
import UniversalEmergencyCard from "@/components/UniversalEmergencyCard";

const Emergency = () => {
    const { toggleDrawer } = useDrawer();

    const renderUniversalEmergencyCard = ({
        item,
    }: {
        item: UniversalEmergencyService;
    }) => <UniversalEmergencyCard item={item} />;

    const renderDistrictEmergencyCard = ({
        item,
    }: {
        item: EmergencyContact;
    }) => <EmergencyCard item={item} />;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <MenuButton
                            onPress={toggleDrawer}
                            size={30}
                            color={styles.buttons.color}
                        />
                        <View>
                            <Text style={styles.headingText}>
                                Emergency Contacts
                            </Text>
                            <Text style={styles.mainSubHeaddingText}>
                                Important contact information
                            </Text>
                        </View>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {/* Universal Emergency Numbers Section */}
                    <View style={styles.sectionContainer}>
                        <FlatList
                            data={universalEmergencyNumbers}
                            renderItem={renderUniversalEmergencyCard}
                            keyExtractor={(item) => item.number}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={styles.universalGrid}
                        />
                    </View>

                    {/* District-wise Emergency Contacts Section */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>
                            District-wise Emergency Contacts
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Local emergency services in BTR districts
                        </Text>
                        <FlatList
                            data={emergencyData}
                            renderItem={renderDistrictEmergencyCard}
                            keyExtractor={(item) => item.identifier}
                            numColumns={2}
                            scrollEnabled={false}
                            contentContainerStyle={styles.districtGrid}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Emergency;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d1116",
        paddingTop: StatusBar.currentHeight,
    },
    content: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    headingText: {
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "SfProMedium",
        color: "#fff",
    },
    mainSubHeaddingText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#646f7e",
    },
    buttons: {
        color: "#fff",
    },
    scrollContainer: {
        paddingHorizontal: 8,
        paddingBottom: 20,
    },
    sectionContainer: {
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        fontFamily: "SfProMedium",
        marginBottom: 4,
        paddingHorizontal: 12,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#646f7e",
        fontFamily: "SfProMedium",
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    universalGrid: {
        paddingHorizontal: 4,
    },
    districtGrid: {
        paddingHorizontal: 4,
    },
});
