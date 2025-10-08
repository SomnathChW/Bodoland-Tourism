type DrawerItemType = {
    label: string;
    key: string;
    icon: string;
};

export const drawerItems: DrawerItemType[] = [
    {
        label: "Home",
        key: "home",
        icon: "home",
    },
    {
        label: "Festivals",
        key: "festivals",
        icon: "festival",
    },
    {
        label: "Cuisine",
        key: "cuisines",
        icon: "bowl-food",
    },
    {
        label: "Transport",
        key: "transport",
        icon: "transport",
    },
];

export const helpItems = [
    {
        label: "Emergency Contacts",
        key: "emergency",
        icon: "phone",
    },
    {
        label: "About the State",
        key: "about",
        icon: "info",
    },
    {
        label: "Cart",
        key: "cart",
        icon: "cart",
    },
    {
        label: "Orders",
        key: "orders",
        icon: "shopping-bag",
    },
    {
        label: "Settings",
        key: "settings",
        icon: "settings",
    },
    {
        label: "Help Center",
        key: "help",
        icon: "help-circle",
    },
];

export const drawerFooterItems = [
    {
        label: "Feedback & Support",
        key: "support",
        icon: "headset",
    },
    {
        label: "Legal & Privacy Policy",
        key: "privacy",
        icon: "shield",
    },
    {
        label: "Logout",
        key: "logout",
        icon: "log-out",
    },
];

export const DRAWER_ROUTES = {
    // Main menu items
    home: "/(protected)/",
    festivals: "/(protected)/festivals",
    cuisines: "/(protected)/cuisines",
    transport: "/(protected)/transport",

    // Help & support items
    emergency: "/(protected)/emergency_contacts",
    about: "/(protected)/about",
    settings: "/(protected)/settings",
    cart: "/(protected)/cart",
    orders: "/(protected)/orders",
    help: "/(protected)/help",

    // Footer items
    support: "/(protected)/feedback",
    privacy: "/(protected)/privacy",
} as const;

// Helper function to get route by key
export const getRouteByKey = (key: string): string | undefined => {
    return DRAWER_ROUTES[key as keyof typeof DRAWER_ROUTES];
};