export type CarouselItemType = "details" | "browser" | "none";

export interface CarouselTypes {
    identifier: string;
    title: string;
    image: any;
    description: string;
    tag?: string;
    promo_url?: string;
    type: CarouselItemType;
}

export const carouselData: CarouselTypes[] = [
    {
        identifier: "attraction_chakrasila",
        title: "Chakrasila Wildlife Sanctuary",
        image: "https://picsum.photos/512/300?random",
        description:
            "A wildlife sanctuary in Assam, India, known for its rich biodiversity and endangered golden langurs.",
        type: "details",
    },
    {
        identifier: "attraction_raimona",
        title: "Manas National Park",
        image: "https://picsum.photos/512/300?random",
        description:
            "A UNESCO World Heritage Site in Assam, India, famous for its national park, tiger reserve, and rich wildlife.",
        type: "details",
    },
    {
        identifier: "promotion_bogamati",
        title: "Bogamati",
        image: "https://picsum.photos/512/300?random",
        description:
            "A scenic picnic spot in Assam, India, located on the banks of the Barnadi River, surrounded by hills and forests.",
        promo_url: "https://www.example.com/bogamati",
        type: "browser",
    },
    {
        identifier: "attraction_dheer_beel",
        title: "Dheer Beel",
        image: "https://picsum.photos/512/300?random",
        description: "A beautiful hill located in Assam.",
        type: "details",
    },
    {
        identifier: "attraction_diplaibeel",
        title: "Diplaibeel",
        image: "https://picsum.photos/512/300?random",
        description:
            "A natural wetland offering scenic views and biodiversity.",
        type: "details",
    },
    {
        identifier: "attraction_raimona",
        title: "Raimona National Park",
        image: "https://picsum.photos/512/300?random",
        description:
            "A national park in Assam, India, known for its lush forests and diverse wildlife, including elephants and hornbills.",
        type: "details",
    },
    {
        identifier: "attraction_manas",
        title: "Manas National Park",
        image: "https://picsum.photos/512/300?random",
        description:
            "A UNESCO World Heritage Site in Assam, India, famous for its national park, tiger reserve, and rich wildlife.",
        type: "details",
    },
    {
        identifier: "attraction_chakrasila",
        title: "Chakrasila Wildlife Sanctuary",
        image: "https://picsum.photos/512/300?random",
        description:
            "A wildlife sanctuary in Assam, India, known for its rich biodiversity and endangered golden langurs.",
        type: "details",
    },
    {
        identifier: "attraction_bogamati",
        title: "Bogamati",
        image: "https://picsum.photos/512/300?random",
        description:
            "A scenic picnic spot in Assam, India, located on the banks of the Barnadi River, surrounded by hills and forests.",
        tag: "New",
        type: "details",
    },
    {
        identifier: "attraction_raimona",
        title: "Raimona National Park",
        image: "https://picsum.photos/512/300?random",
        description:
            "A national park in Assam, India, known for its lush forests and diverse wildlife, including elephants and hornbills.",
        tag: "New",
        type: "details",
    },
];
