export default function inFilter(column, values) {
  return `${column}=in.(${values.map((v) => `"${v}"`).join(",")})`;
}
