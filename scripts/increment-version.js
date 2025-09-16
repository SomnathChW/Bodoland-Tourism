#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Path to app.json (go up one level from scripts directory)
const appJsonPath = path.join(__dirname, "..", "app.json");

// Version increment types
const VERSION_TYPES = {
    PATCH: "patch",
    MINOR: "minor",
    MAJOR: "major",
};

/**
 * Increment semantic version
 * @param {string} version - Current version (e.g., "0.0.12")
 * @param {string} type - Type of increment (patch, minor, major)
 * @returns {string} - New version
 */
function incrementSemanticVersion(version, type = VERSION_TYPES.PATCH) {
    const [major, minor, patch] = version.split(".").map(Number);

    switch (type) {
        case VERSION_TYPES.MAJOR:
            return `${major + 1}.0.0`;
        case VERSION_TYPES.MINOR:
            return `${major}.${minor + 1}.0`;
        case VERSION_TYPES.PATCH:
        default:
            return `${major}.${minor}.${patch + 1}`;
    }
}

/**
 * Main function to increment version
 * @param {string} versionType - Type of version increment
 */
function incrementVersion(versionType = VERSION_TYPES.PATCH) {
    try {
        // Read app.json
        const appJsonContent = fs.readFileSync(appJsonPath, "utf8");
        const appConfig = JSON.parse(appJsonContent);

        // Get current versions
        const currentVersion = appConfig.expo.version;
        const currentVersionCode = appConfig.expo.android.versionCode;

        // Increment semantic version
        const newVersion = incrementSemanticVersion(
            currentVersion,
            versionType
        );

        // Increment version code (always increment by 1)
        const newVersionCode = currentVersionCode + 1;

        // Update the config
        appConfig.expo.version = newVersion;
        appConfig.expo.android.versionCode = newVersionCode;

        // Write back to file with proper formatting
        fs.writeFileSync(
            appJsonPath,
            JSON.stringify(appConfig, null, 4) + "\n",
            "utf8"
        );

        console.log("✅ Version updated successfully!");
        console.log(`📦 Version: ${currentVersion} → ${newVersion}`);
        console.log(
            `🤖 Android Version Code: ${currentVersionCode} → ${newVersionCode}`
        );
    } catch (error) {
        console.error("❌ Error updating version:", error.message);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const versionType = args[0] || VERSION_TYPES.PATCH;

// Validate version type
if (!Object.values(VERSION_TYPES).includes(versionType)) {
    console.error(`❌ Invalid version type: ${versionType}`);
    console.error(`Valid types: ${Object.values(VERSION_TYPES).join(", ")}`);
    process.exit(1);
}

// Show usage if help is requested
if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🚀 Version Increment Script

Usage: node scripts/increment-version.js [version-type]

Version Types:
  patch   - Increment patch version (0.0.12 → 0.0.13) [default]
  minor   - Increment minor version (0.0.12 → 0.1.0)
  major   - Increment major version (0.0.12 → 1.0.0)

Examples:
  node scripts/increment-version.js patch
  node scripts/increment-version.js minor
  node scripts/increment-version.js major

The script will also automatically increment the Android versionCode by 1.
  `);
    process.exit(0);
}

// Run the increment
incrementVersion(versionType);
