/** @format */
/**
 * Ambient type declarations for the qrcode package and .ttf imports.
 */
declare module "qrcode" {
  interface QRCodeToStringOptions {
    type?: "svg" | "terminal" | "utf8";
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
  export function toString(text: string, options?: QRCodeToStringOptions): Promise<string>;
  export function toDataURL(
    text: string,
    options?: {
      type?: "image/png" | "image/webp";
    } & QRCodeToStringOptions
  ): Promise<string>;
}
declare module "*.ttf" {
  const value: number;
  export default value;
}
