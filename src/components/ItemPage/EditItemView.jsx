import ItemForm from "./ItemForm";

export default function EditItemView({ itemToEdit, setItemToEdit }) {
  return (
    <div className="h-screen w-[30%] absolute right-0 bg-slate-800">
      <ItemForm itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} />
    </div>
  );
}
