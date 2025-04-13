import Image from "next/image";
import Link from "next/link";
export default function LogoIcon() {
  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src="/output-onlinepngtools.png"
        alt="logo"
        width={72}
        height={72}
        className="z-30 cursor-pointer grayscale filter"
      />
    </Link>
  );
}
