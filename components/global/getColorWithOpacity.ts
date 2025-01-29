export default function getColorWithOpacity(color: string, opacity: number): string {
    // Check if the input is a hex color and convert it to rgba
    if (color.startsWith("#")) {
      let r = 0,
        g = 0,
        b = 0;
  
      if (color.length === 4) {
        // #RGB format
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
      } else if (color.length === 7) {
        // #RRGGBB format
        r = parseInt(color.substring(1, 3), 16);
        g = parseInt(color.substring(3, 5), 16);
        b = parseInt(color.substring(5, 7), 16);
      } else {
        throw new Error("Invalid hex color format.");
      }
  
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  
    // For named colors, rgb, and rgba, use canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    if (!context) {
      throw new Error("Unable to create canvas context.");
    }
  
    context.fillStyle = color;
    const computedColor = context.fillStyle;
  
    const rgbaMatch = computedColor.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  
    if (!rgbaMatch) {
      throw new Error("Invalid color format.");
    }
  
    const [, r, g, b] = rgbaMatch;
  
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }