export class Item {
  constructor(id, name, isAvailable, owner) {
    this.id = id;
    this.name = name;
    this.isAvailable = isAvailable;
    this.owner = owner;
  }
}

export const itemData = [
  new Item(1, "Pot", true, 1),
  new Item(2, "Pan", true, 2),
  new Item(3, "Chair", true, 3),
  new Item(4, "Kayak", true, 1),
];

//
