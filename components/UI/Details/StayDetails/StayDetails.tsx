import { StyleSheet, Text, View } from "react-native";
import React from "react";

const StayDetails = ({ identifier }: { identifier: string }) => {
    return (
        <View>
            <Text>StayDetails for: {identifier}</Text>
        </View>
    );
};

export default StayDetails;

const styles = StyleSheet.create({});
