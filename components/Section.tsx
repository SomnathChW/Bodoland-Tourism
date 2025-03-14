import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CardList from "./CardList";

type SectionProps = {
    subHeading?: string;
    data: any[]; // Adjust the type as needed
    cardComponent: React.ElementType; // This will be the component name
    viewAll?: () => void; // Make the viewAll prop optional
    style?: any;
};

const Section = ({
    subHeading,
    data,
    cardComponent,
    viewAll,
    style,
}: SectionProps) => {
    return (
        <View style={[{ marginBottom: 20 }, style]}>
            <View style={styles.mainBodyPaddingView}>
                <View style={styles.subHeaddingView}>
                    {subHeading && (
                        <Text style={styles.subHeaddings}>{subHeading}</Text>
                    )}
                    {viewAll && (
                        <Text style={styles.links} onPress={viewAll}>
                            View More
                        </Text>
                    )}
                </View>
            </View>
            <CardList itemList={data} CardComponent={cardComponent} />
        </View>
    );
};

export default Section;

const styles = StyleSheet.create({
    mainBodyPaddingView: {
        paddingHorizontal: 20,
    },
    subHeaddingView: {
        justifyContent: "space-between",
        flexDirection: "row",
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
        fontSize: 16,
        color: "#646f7e",
        paddingTop: 5,
    },
});
