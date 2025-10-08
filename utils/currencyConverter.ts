/**
 * Currency Converter Utility
 * Author: SomnathChW
 * Created: 2025-10-04
 *
 * This utility converts currency codes to their respective symbols
 */

/**
 * Map of currency codes to symbols
 */
const currencySymbols: { [key: string]: string } = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "Fr",
    SEK: "kr",
    NZD: "NZ$",
    KRW: "₩",
    SGD: "S$",
    HKD: "HK$",
    NOK: "kr",
    MXN: "$",
    BRL: "R$",
    ZAR: "R",
    RUB: "₽",
    TRY: "₺",
    THB: "฿",
    IDR: "Rp",
    MYR: "RM",
    PHP: "₱",
    VND: "₫",
    AED: "د.إ",
    SAR: "﷼",
};

/**
 * Convert currency code to symbol
 * @param currencyCode - Currency code (e.g., "INR", "USD")
 * @param defaultSymbol - Default symbol if code not found (default: "₹")
 * @returns Currency symbol
 */
export const getCurrencySymbol = (
    currencyCode?: string,
    defaultSymbol: string = "₹"
): string => {
    if (!currencyCode) return defaultSymbol;

    // Convert to uppercase and trim
    const code = currencyCode.toUpperCase().trim();

    // Return symbol if found, otherwise return the code itself or default
    return currencySymbols[code] || code || defaultSymbol;
};

/**
 * Format price with currency symbol
 * @param price - Price value
 * @param currencyCode - Currency code (e.g., "INR", "USD")
 * @param defaultSymbol - Default symbol if code not found
 * @returns Formatted price string (e.g., "₹2,500")
 */
export const formatPrice = (
    price: string | number,
    currencyCode?: string,
    defaultSymbol: string = "₹"
): string => {
    const symbol = getCurrencySymbol(currencyCode, defaultSymbol);
    const priceStr = typeof price === "number" ? price.toString() : price;

    // Add thousand separators
    const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${symbol}${formattedPrice}`;
};

/**
 * Check if a string is a valid currency code
 * @param currencyCode - Currency code to check
 * @returns True if valid currency code
 */
export const isValidCurrencyCode = (currencyCode: string): boolean => {
    return currencyCode.toUpperCase().trim() in currencySymbols;
};
