export interface EmergencyContact {
    identifier: string;
    title: string;
    image: string;
    police: string;
    fire: string;
    ambulance: string;
    extra_data: Record<string, any>;
}

export interface UniversalEmergencyService {
    name: string;
    number: string;
    icon: string;
    color: string;
    gradientColors: [string, string, ...string[]];
}

export const universalEmergencyNumbers = [
    {
        name: "Police",
        number: "100",
        icon: "shield-checkmark",
        color: "#7dd3fc",
        gradientColors: [
            "rgba(14, 165, 233, 0.15)",
            "rgba(14, 165, 233, 0.09)",
        ] as [string, string, ...string[]],
    },
    {
        name: "Fire Brigade",
        number: "101",
        icon: "flame",
        color: "#fb923c",
        gradientColors: [
            "rgba(234, 88, 12, 0.15)",
            "rgba(234, 88, 12, 0.09)",
        ] as [string, string, ...string[]],
    },
    {
        name: "Ambulance",
        number: "108",
        icon: "ambulance",
        color: "#4ade80",
        gradientColors: [
            "rgba(34, 197, 94, 0.15)",
            "rgba(34, 197, 94, 0.09)",
        ] as [string, string, ...string[]],
    },
    {
        name: "Emergency",
        number: "112",
        icon: "call",
        color: "#f87171",
        gradientColors: [
            "rgba(239, 68, 68, 0.15)",
            "rgba(239, 68, 68, 0.09)",
        ] as [string, string, ...string[]],
    },
];
