import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TransportDetails = ({ identifier }: { identifier: string }) => {
    return (
        <View>
            <Text>TransportDetails for: {identifier}</Text>
        </View>
    );
};

export default TransportDetails;

const styles = StyleSheet.create({});
