import Image from "next/image";

interface Props {
  label: string;
}
const Empty = ({ label }: Props) => {
  return (
    <div className="h-full p- flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image src={"/empty.png"} alt="Empty" fill />
      </div>
      <p className=" text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};

export default Empty;
