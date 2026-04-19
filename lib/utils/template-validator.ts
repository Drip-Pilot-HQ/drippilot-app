export const ALLOWED_PLACEHOLDERS = [
  "lead.email",
  "lead.phone",
  "lead.firstName",
  "lead.lastName",
  "lead.address",
];

export function validateTemplatePlaceholders(content: string): {
  isValid: boolean;
  invalidPlaceholders: string[];
  errorMessages: string[];
} {
  const errorMessages: string[] = [];
  const invalidPlaceholders: string[] = [];

  // 1. Basic Balance Check (The most common error)
  const openCount = (content.match(/{{/g) || []).length;
  const closeCount = (content.match(/}}/g) || []).length;

  if (openCount > closeCount) {
    errorMessages.push(`Missing ${openCount - closeCount} closing braces '}}'`);
  } else if (closeCount > openCount) {
    errorMessages.push(
      `Found ${closeCount - openCount} stray closing braces '}}'`,
    );
  }

  // 2. Syntax Malformation Check (Dismembered Braces)
  const contentWithoutPairs = content.replace(/{{.*?}}/g, "");
  const singleOpen = (contentWithoutPairs.match(/{/g) || []).length;
  if (singleOpen > 0) {
    errorMessages.push(
      "Syntax Error: Found '{' without its partner. Brackets must always be double '{{'",
    );
  }

  const singleClose = (contentWithoutPairs.match(/}/g) || []).length;
  if (singleClose > 0) {
    errorMessages.push(
      "Syntax Error: Found '}' without its partner. Brackets must always be double '}}'",
    );
  }

  // 3. Placeholder Logic Validation
  const placeholderRegex = /{{(.*?)}}/g;
  const matches = [...content.matchAll(placeholderRegex)];

  for (const match of matches) {
    const rawMatch = match[0];
    const placeholder = match[1].trim();

    // Check for weirdness inside the brackets (like another bracket)
    if (placeholder.includes("{") || placeholder.includes("}")) {
      errorMessages.push(
        `Dismembered or broken bracket syntax found near: ${rawMatch}`,
      );
      continue;
    }

    if (!placeholder) {
      errorMessages.push("Empty variable tag '{{ }}' detected.");
      continue;
    }

    // Handle both {{placeholder}} and {{ .placeholder }} common in Go/Handlebars
    const cleanPlaceholder = placeholder.startsWith(".")
      ? placeholder.substring(1).trim()
      : placeholder;

    if (!ALLOWED_PLACEHOLDERS.includes(cleanPlaceholder)) {
      invalidPlaceholders.push(rawMatch);
      errorMessages.push(
        `Variable correctly syntaxed but not recognized: ${rawMatch}`,
      );
    }
  }

  return {
    isValid: errorMessages.length === 0,
    invalidPlaceholders,
    errorMessages,
  };
}
