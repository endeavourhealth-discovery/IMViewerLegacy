export function toSentenceCase(text: string) {
  if (typeof text === "string"){
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
  } else {
    return text;
  }
}
