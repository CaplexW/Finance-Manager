export default function getCategoryIcon(color: string, icon: SVGImageElement ): SVGImageElement {
  const iconCopy = icon.cloneNode(true) as SVGImageElement;
  iconCopy.setAttribute('fill', color);
  return iconCopy;
}
