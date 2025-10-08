import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CardList from "@/components/UI/Section/CardList";

type SectionProps = {
    subHeading?: string;
    data: any[]; // Adjust the type as needed
    cardComponent: React.ElementType; // This will be the component name
    viewAll?: () => void; // Make the viewAll prop optional
    style?: any;
    isLoading?: boolean;
    loadingCardCount?: number;
    cardType?: "horizontal" | "vertical"; // Optional explicit card type
};

const Section = React.memo(
    ({
        subHeading,
        data,
        cardComponent,
        viewAll,
        style,
        isLoading = false,
        loadingCardCount = 3,
        cardType,
    }: SectionProps) => {
        return (
            <View style={[{ marginBottom: 20 }, style]}>
                <View style={styles.mainBodyPaddingView}>
                    <View style={styles.subHeaddingView}>
                        {subHeading && (
                            <Text style={styles.subHeaddings}>
                                {subHeading}
                            </Text>
                        )}
                        {viewAll && (
                            <Text style={styles.links} onPress={viewAll}>
                                View More
                            </Text>
                        )}
                    </View>
                </View>
                <CardList
                    itemList={data}
                    CardComponent={cardComponent}
                    isLoading={isLoading}
                    loadingCardCount={loadingCardCount}
                    cardType={cardType}
                />
            </View>
        );
    }
);

export default Section;

const styles = StyleSheet.create({
    mainBodyPaddingView: {
        paddingHorizontal: 20,
    },
    subHeaddingView: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    subHeaddings: {
        fontFamily: "SfProMedium",
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    links: {
        fontFamily: "SfProMedium",
        fontSize: 14,
        color: "#646f7e",
        paddingTop: 5,
    },
});
