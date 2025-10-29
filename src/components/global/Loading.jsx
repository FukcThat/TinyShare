import { DotLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <DotLoader color="white" />
    </div>
  );
}
