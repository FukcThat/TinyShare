export default function BgPanel({ children }) {
  return (
    <div className="bg-secondary p-4 rounded-xl shadow  hover:shadow-accent/90 shadow-accent/50 flex flex-col items-center justify-between w-[90%] gap-4">
      {children}
    </div>
  );
}
