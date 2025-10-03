import { UseGlobal } from "./context/GlobalContext";

function App({ className }) {
  const { test2 } = UseGlobal();
  return (
    <div className={` bg-amber-950 dark:bg-black m-5 hover:m-10 ${className}`}>
      Hello {test2}!
    </div>
  );
}

export default App;
