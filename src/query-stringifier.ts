import qs from "qs";

export function stringifyData(data: Record<string, unknown>): string {
  return qs.stringify(data, {
    encode: true,
    addQueryPrefix: false,
    arrayFormat: "brackets",
  });
}
