import {
    Ionicons,
    MaterialIcons,
    Entypo,
    FontAwesome5,
} from "@expo/vector-icons";

export const icons = {
    attractions: (props: any) => (
        <MaterialIcons name="attractions" {...props} />
    ),
    virtual_tours: (props: any) => (
        <FontAwesome5 name="vr-cardboard" {...props} />
    ),
    index: (props: any) => <Ionicons name="home" {...props} />,
    stays: (props: any) => <FontAwesome5 name="hotel" {...props} />,
    souvenirs: (props: any) => <Entypo name="shop" {...props} />,
};
