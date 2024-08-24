import {
    Ionicons,
    FontAwesome,
    MaterialIcons,
    Entypo,
} from "@expo/vector-icons";

export const icons = {
    attractions: (props: any) => (
        <MaterialIcons name="attractions" {...props} />
    ),
    festivals: (props: any) => <MaterialIcons name="festival" {...props} />,
    index: (props: any) => <Ionicons name="home" {...props} />,
    cuisine: (props: any) => <FontAwesome name="cutlery" {...props} />,
    souvenirs: (props: any) => <Entypo name="shop" {...props} />,
};
