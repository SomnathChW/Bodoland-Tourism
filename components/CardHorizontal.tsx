import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Pressable,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

type Props = {
    item: any;
};

const { width, height } = Dimensions.get("screen");

const CardHorizontal = ({ item }: Props) => {
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
            >
                <Image source={item.image} style={styles.image} />
                <LinearGradient
                    colors={["transparent", " rgba(0, 0, 0, 0.6)"]}
                    style={styles.textView}
                >
                    <View style={styles.textView}>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                </LinearGradient>
            </Pressable>
        </View>
    );
};

export default CardHorizontal;

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        justifyContent: "center",
        width: width * 0.6,
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        shadowOffset: { width: 10, height: 0 },
    },
    image: {
        width: width * 0.6,
        height: height * 0.15,
        borderRadius: 10,
    },
    textView: {
        position: "absolute",
        width: width * 0.6,
        height: height * 0.15,
        padding: 15,
        borderRadius: 10,
        justifyContent: "flex-end",
    },
    title: {
        fontFamily: "SfProMedium",
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginHorizontal: 5,
    },
    description: {
        fontFamily: "SfProMedium",
        fontSize: 12,
        color: "white",
        marginHorizontal: 5,
    },
});
