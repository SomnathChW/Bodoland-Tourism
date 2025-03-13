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
        <View style={[styles.card]}>
            <Pressable
                onPress={() =>
                    router.navigate({
                        pathname: "/details",
                        params: { identifier: item.identifier },
                    })
                }
                style={{ alignItems: "center" }}
            >
                <Image source={item.image} style={styles.image} />
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
        borderRadius: 50,
    },
    image: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: 50,
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        color: "#646f7e",
        marginTop: 5,
    },
});
