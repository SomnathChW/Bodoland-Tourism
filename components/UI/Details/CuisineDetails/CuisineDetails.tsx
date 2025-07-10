import { StyleSheet, Text, View } from "react-native";
import React from "react";

const CuisineDetails = ({ identifier }: { identifier: string }) => {
    return (
        <View>
            <Text>CuisineDetails for: {identifier}</Text>
        </View>
    );
};

export default CuisineDetails;

const styles = StyleSheet.create({});
