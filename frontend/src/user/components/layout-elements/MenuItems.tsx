import { MenuContext } from "@/contexts/MenuContext";
import { cn } from "@/lib/utils";
import { Menu as BurgerMenuIcon, X as CloseIcon } from "lucide-react";
import { useContext } from "react";
import LogoIcon from "./LogoIcon";
import RenderItems from "./RenderItems";

export default function MenuItems({ className }: { className: string }) {
  const { setIsMenuOpen, isMenuOpen } = useContext(MenuContext);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const menuItems = [
    { text: "Qui sommes-nous", path: "/" },
    { text: "Nos avantages", path: "/advantages" },
    { text: "Notre station", path: "/station" },
    { text: "Notre materiel", path: "/products" },
  ];

  return (
    <nav className="flex w-full">
      <ul
        className={cn(
          className,
          "hidden w-full lg:my-3 lg:flex lg:w-full lg:items-center lg:justify-evenly",
        )}
      >
        <RenderItems
          layoutItems={menuItems}
          className="mt-7 text-center capitalize lg:mt-0"
        />
      </ul>

      <div className="flex items-center justify-end lg:hidden">
        <div className="cursor-pointer items-center" onClick={toggleMenu}>
          <BurgerMenuIcon className="" />
        </div>
      </div>
      <div
        onClick={toggleMenu}
        className={`absolute left-0 top-0 z-10 flex h-screen w-full flex-col content-stretch overflow-hidden bg-white pb-16 pt-0 shadow-xl transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="mx-2 mt-2 flex w-full items-center">
          <span className="w-full">
            <LogoIcon />
          </span>
          <CloseIcon className="mr-4 cursor-pointer" onClick={toggleMenu} />
        </div>
        {isMenuOpen && (
          <>
            <ul className="h-full">
              <RenderItems
                className="mt-7 text-center capitalize lg:mt-0"
                layoutItems={menuItems}
                toggleMenu={toggleMenu}
              />
            </ul>
          </>
        )}
      </div>
    </nav>
  );
}
