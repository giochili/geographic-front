export const sanitizeWindowsPath = (text) => {
  if (!text) return "";
  const trimmed = text.trim();
  return trimmed.replace(/^"|"$/g, "");
};

