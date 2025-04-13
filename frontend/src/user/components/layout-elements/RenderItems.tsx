import { cn } from "@/lib/utils";
import Link from "next/link";

type LayoutItems = {
  text: string | JSX.Element;
  path: string;
};
export default function RenderItems({
  layoutItems,
  className,
  toggleMenu,
}: {
  layoutItems: LayoutItems[];
  className: string;
  toggleMenu?: () => void;
}) {
  return (
    <>
      {layoutItems.map((layoutItem, index) => (
        <li key={index} className={cn(className)} onClick={toggleMenu}>
          <Link href={layoutItem.path}>{layoutItem.text}</Link>
        </li>
      ))}
    </>
  );
}
