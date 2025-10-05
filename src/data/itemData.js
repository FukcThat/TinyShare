export const itemData = [
  new Item(1, "Pot", "available", 1),
  new Item(2, "Pan", "borrowed", 2),
  new Item(3, "Chair", "unavailable", 3),
  new Item(4, "Kayak", "available", 1),
];

class Item {
  constructor(id, name, status, owner) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.owner = owner;
  }
}
