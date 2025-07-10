import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SouvenirDetails = ({ identifier }: { identifier: string }) => {
    return (
        <View>
            <Text>Souvenir Details for: {identifier}</Text>
        </View>
    );
};

export default SouvenirDetails;

const styles = StyleSheet.create({});
