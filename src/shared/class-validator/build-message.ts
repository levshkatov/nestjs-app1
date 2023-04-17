export default function buildMessage(property: string, errorStr: string): string {
  return `${property}\\${property}: ${errorStr}`;
}
