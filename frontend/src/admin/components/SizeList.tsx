// import { SizeType } from "@/types";
// import { useState } from "react";
// import SizeItem from "./SizeItem";

// const SizeList = ({ sizes, onFormSelectedSize } : { sizes: SizeType[], onFormSelectedSize: () => void}) => {

//   const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
//   const handleSelectSize = (item) => {
//     console.log("handleSelectSize", item)
//     let currentSize = sizes.filter((s) => s.label === item.label );
//     console.log('currentSize: ', currentSize)
//     setSelectedSize({
//       ...item,
//       isActive: !item.isActive
//     });
//     onFormSelectedSize(item.label)
//   }

//   return sizes && (
//     <ul className="flex gap-4">
//       {sizes && sizes.map((size) => (
//         <SizeItem
//           key={`size_${size.label}`}
//           item={size}
//           selectedSize={selectedSize}
//           setSelectedSize={setSelectedSize}
//           onHandleSelectSize={handleSelectSize}
//         />
//       ))}
//     </ul>
//   )
// }

// export default SizeList;
