import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Linking,
    Pressable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

type Props = {
    item: any;
};

const { width, height } = Dimensions.get("screen");

const DistrictCards = ({ item }: Props) => {
    const router = useRouter();

    return (
        <View style={styles.card}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
                style={{ alignItems: "center" }}
            >
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                </View>
                <Text style={styles.title}>{item.title}</Text>
            </Pressable>
        </View>
    );
};

export default DistrictCards;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    imageContainer: {
        width: width * 0.2,
        height: width * 0.2,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: "rgba(52, 52, 52, 0.35)",
    },
    image: {
        width: "70%",
        height: "70%",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        color: "#646f7e",
    },
});
