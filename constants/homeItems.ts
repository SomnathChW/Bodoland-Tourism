import CardVertical from "@/components/UI/Section/CardVertical";
import CardHorizontal from "@/components/UI/Section/CardHorizontal";
import CategoryCard from "@/components/UI/QuickLinks/CategoryCard";

export type HomeItemTemplateType =
    | {
          type: "carousel";
          id: string;
          dataKey: string;
      }
    | {
          type: "quicklinks";
          id: string;
          dataKey: string;
          cardComponent: typeof CategoryCard;
          itemsPerRow: number;
      }
    | {
          type: "section";
          id: string;
          subHeading: string;
          dataKey: string;
          cardComponent: typeof CardVertical | typeof CardHorizontal;
          viewAllKey?: string;
      }
    | {
          type: "end";
          id: "end";
      };

export const homeItemsTemplate: HomeItemTemplateType[] = [
    {
        type: "carousel",
        id: "carousel",
        dataKey: "featuredData",
    },
    {
        type: "quicklinks",
        id: "quicklinks",
        dataKey: "categoryData",
        cardComponent: CategoryCard,
        itemsPerRow: 5,
    },
    {
        type: "section",
        id: "districts",
        subHeading: "Districts",
        dataKey: "districtData",
        cardComponent: CardVertical,
    },
    {
        type: "section",
        id: "virtual_tours",
        subHeading: "Virtual Tours",
        dataKey: "virtualToursData",
        cardComponent: CardHorizontal,
        viewAllKey: "virtual_tours",
    },
    {
        type: "section",
        id: "festivals",
        subHeading: "Festivals",
        dataKey: "festivalsData",
        cardComponent: CardVertical,
        viewAllKey: "festivals",
    },
    {
        type: "section",
        id: "cuisines",
        subHeading: "Cuisines",
        dataKey: "cuisinesData",
        cardComponent: CardHorizontal,
        viewAllKey: "cuisines",
    },
    {
        type: "section",
        id: "souvenirs",
        subHeading: "Souvenirs",
        dataKey: "souvenirsData",
        cardComponent: CardVertical,
        viewAllKey: "souvenirs",
    },
    {
        type: "section",
        id: "attractions",
        subHeading: "Attractions",
        dataKey: "attractionsData",
        cardComponent: CardHorizontal,
        viewAllKey: "attractions",
    },
    {
        type: "end",
        id: "end",
    },
];
