import Image from "next/image";

export default function Img({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width="200"
      height="200"
      className="w-8 h-8 mx-2"
      onError={(e) => {
        e.currentTarget.src = "https://s8.uupload.ir/files/world_huh4.png";
        e.currentTarget.classList.add("wi");
      }}
    />
  );
}
