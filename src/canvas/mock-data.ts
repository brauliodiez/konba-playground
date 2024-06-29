import { ImageData } from "./canvas.model";

export const mockWidgetImageCollection: ImageData[] = [
  { imageUrl: "/widgets/combobox.svg", coord: { x: 50, y: 50 } },
  { imageUrl: "/widgets/input.svg", coord: { x: 400, y: 50 } },
  { imageUrl: "/widgets/button.svg", coord: { x: 800, y: 50 } },
];

export const mockLayoutImageCollection: ImageData[] = [
  { imageUrl: "/containers/browser.svg", coord: { x: 50, y: 300 } },
  { imageUrl: "/containers/mobile.svg", coord: { x: 600, y: 300 } },
  { imageUrl: "/containers/tablet.svg", coord: { x: 900, y: 300 } },
];
