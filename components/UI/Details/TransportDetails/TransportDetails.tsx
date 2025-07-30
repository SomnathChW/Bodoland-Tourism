import { StyleSheet, Text, View } from "react-native";
import React from "react";

type TransportDetailsProps = {
    identifier: string;
    onDataFetched?: (data: any) => void;
    onError?: () => void;
};

const TransportDetails = ({
    identifier,
    onDataFetched,
    onError,
}: TransportDetailsProps) => {

    return (
        <View>
            <Text>TransportDetails for: {identifier}</Text>
        </View>
    );
};

export default TransportDetails;

const styles = StyleSheet.create({});
