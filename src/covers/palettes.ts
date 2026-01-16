// Curated color palette - aesthetically pleasing solid colors
export const SOLID_COLORS = [
	"#FF6B6B", // Coral Red
	"#4ECDC4", // Teal
	"#45B7D1", // Sky Blue
	"#96CEB4", // Sage Green
	"#FFEAA7", // Soft Yellow
	"#DDA0DD", // Plum
	"#98D8C8", // Mint
	"#F7DC6F", // Mustard
	"#BB8FCE", // Lavender
	"#85C1E9", // Light Blue
	"#F8B500", // Golden
	"#82E0AA", // Light Green
	"#F1948A", // Salmon
	"#AED6F1", // Powder Blue
	"#D7BDE2", // Light Purple
	"#A3E4D7", // Aquamarine
];

// Curated gradient palette - beautiful gradient combinations
export const GRADIENTS = [
	["#667eea", "#764ba2"], // Purple Dream
	["#f093fb", "#f5576c"], // Pink Sunset
	["#4facfe", "#00f2fe"], // Ocean Blue
	["#43e97b", "#38f9d7"], // Fresh Mint
	["#fa709a", "#fee140"], // Summer Peach
	["#a8edea", "#fed6e3"], // Soft Pink Teal
	["#d299c2", "#fef9d7"], // Romantic
	["#89f7fe", "#66a6ff"], // Cool Sky
	["#cd9cf2", "#f6f3ff"], // Lavender Mist
	["#fddb92", "#d1fdff"], // Sunrise
	["#96fbc4", "#f9f586"], // Lime Glow
	["#c1dfc4", "#deecdd"], // Sage Mist
	["#ffecd2", "#fcb69f"], // Peach Cream
	["#a1c4fd", "#c2e9fb"], // Winter Sky
	["#d4fc79", "#96e6a1"], // Spring Green
	["#84fab0", "#8fd3f4"], // Teal Breeze
];

// Hash function to get consistent index from string
export function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

export function getColorForName(name: string): string {
	const index = hashString(name) % SOLID_COLORS.length;
	return SOLID_COLORS[index];
}

export function getGradientForName(name: string): [string, string] {
	const index = hashString(name) % GRADIENTS.length;
	return GRADIENTS[index] as [string, string];
}
