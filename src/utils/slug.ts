import slug from "./slugify.js";

export const slugify = (text: string | undefined) => {
	if (!text) {
		return "";
	}

	const cleanedText = text.trim().replaceAll(/[^\d\sA-Za-z]/g, "");
	return slug(cleanedText, {
		lower: true,
		strict: true,
		trim: true,
	});
};
