export function toNumber(value: string) {
  return value.replace(/[^0-9a-zA-Z]+/g, "");
}
