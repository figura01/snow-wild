import { Button } from "@/ui/Button";
import { Command, CommandList } from "@/ui/Command";
import { Bell, Package2 } from "lucide-react";
import Link from "next/link";

import { LIST_CATEGORIES } from "@/requetes/queries/category.queries";
import { useQuery } from "@apollo/client";

import Navigation from "./Navigation";

const SideBar = () => {
  const { data, loading, error } = useQuery(LIST_CATEGORIES);
  console.log(data);
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">SnowWild</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grow h-full">
            <Command>
              <CommandList>
                <Navigation />
                {/* <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Products</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion> */}
              </CommandList>
            </Command>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
