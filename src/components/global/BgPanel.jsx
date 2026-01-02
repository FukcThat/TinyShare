export default function BgPanel({ children }) {
  return (
    <div className="bg-secondary p-4 rounded-xl shadow shadow-accent/50 flex flex-col items-center justify-between w-[90%] gap-4">
      {children}
    </div>
  );
}
