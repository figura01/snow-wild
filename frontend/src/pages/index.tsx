import ListMaterial from "@/user/components/ListMaterial";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <ListMaterial />
    </main>
  );
}
