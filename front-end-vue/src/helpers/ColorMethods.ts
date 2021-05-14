// generates lighter graph segment colours for mouse hover
export function colorLighter(color: string): string | void {
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  const rgbColor = hexToRgb(color);
  if (rgbColor) {
    const rDiff = (255 - rgbColor.r) * 0.5; //0.5 = 50% lighter than original colour
    const gDiff = (255 - rgbColor.g) * 0.5;
    const bDiff = (255 - rgbColor.b) * 0.5;
    const newHex = rgbToHex(
      Math.round(rgbColor.r + rDiff),
      Math.round(rgbColor.g + gDiff),
      Math.round(rgbColor.b + bDiff)
    );
    return newHex;
  }
}
