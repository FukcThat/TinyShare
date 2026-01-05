import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import { useItemContext } from '../../context/item_context/useItemContext';
import useCreateItem from '../../hooks/tanstack_mutations/useCreateItem';
import { useSession } from '../../context/session_context/useSession';
import TextArea from '../ui/TextArea';

export default function ItemForm({ setIsOpen }) {
  const { session } = useSession();
  const { itemToEdit } = useItemContext();
  const [formData, setFormData] = useState({
    name: '',
    isAvailable: true,
    description: '',
    imgFile: null,
    imgPreview: null,
  });

  const CreateItem = useCreateItem();

  const HandleCreateItem = async (e) => {
    e.preventDefault();
    if (formData.name == '') return;

    CreateItem.mutate(
      {
        owner: session.user.id,
        is_available: formData.isAvailable,
        name: formData.name,
        description: formData.description,
        file: formData.imgFile,
      },
      {
        onSuccess: () =>
          setFormData({
            isAvailable: true,
            name: '',
            description: '',
            imgFile: null,
            imgPreview: null,
          }),
      }
    );
  };

  return (
    <form
      onSubmit={HandleCreateItem}
      className="flex flex-col w-full items-center gap-4 bg-primary p-2 rounded-xl"
    >
      {formData.imgPreview && (
        <div className="w-24 h-24">
          <img
            className="h-full w-full object-cover rounded-md"
            src={formData.imgPreview}
            alt="preview"
          />
        </div>
      )}
      <div className="w-full flex flex-col md:grid md:grid-cols-2 my-2">
        <label
          htmlFor="img-picker"
          className="text-lg m-0 md:ml-4 cursor-pointer"
        >
          Image
        </label>
        <input
          id="img-picker"
          type="file"
          multiple={false}
          accept="image/*"
          className="w-full  text-center rounded-md cursor-pointer"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setFormData((prev) => ({
              ...prev,
              imgFile: file,
              imgPreview: URL.createObjectURL(file),
            }));
          }}
        />
      </div>

      <Input
        disabled={CreateItem.isPending}
        id="name"
        outerStyles="w-full flex flex-col md:grid md:grid-cols-2"
        placeholder=""
        value={formData.name}
        withLabel
        labelText="Item Name"
        labelStyles="m-0 md:ml-4"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <div className="w-full flex flex-col md:grid md:grid-cols-2">
        <label
          htmlFor="item-description"
          className="m-0 md:ml-4 text-lg cursor-pointer"
        >
          Description
        </label>
        <TextArea
          id="item-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <Checkbox
        disabled={CreateItem.isPending}
        id="isAvailableCheckbox"
        labelText="Available"
        styles="flex justify-center gap-6 md:grid md:grid-cols-2 w-full px-4 text-lg md:gap-0 accent-accent"
        onChange={() =>
          setFormData({ ...formData, isAvailable: !formData.isAvailable })
        }
        value={formData.isAvailable}
      />
      <div className="flex w-full justify-around">
        <Button
          disabled={CreateItem.isPending}
          text={itemToEdit === null ? 'Submit' : 'Update'}
          type="submit"
          styles="bg-accent/80 hover:bg-accent"
        />
        <Button
          disabled={CreateItem.isPending}
          type="button"
          text="Cancel"
          styles="bg-warning/80 hover:bg-warning"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </form>
  );
}
