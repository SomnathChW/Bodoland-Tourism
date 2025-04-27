type DrawerItemType = {
    label: string;
    key: string;
    icon: string;
};

export const drawerItems = [
    {
        label: "Home",
        key: "/(protected)/",
        icon: "home",
    },
    {
        label: "Festivals",
        key: "/(protected)/festivals",
        icon: "festival",
    },
    {
        label: "Cuisine",
        key: "/(protected)/cuisine",
        icon: "bowl-food",
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
        label: "Notifications",
        key: "notifications",
        icon: "bell",
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
