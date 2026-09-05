import React, { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: -20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 10,
  },
  {
    id: 490476,
    name: "Tommy",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [items, setItems] = useState(initialFriends);
  const [selectedFriends, setSelectedFriends] = useState([]);
  function addFriendFunc(item) {
    setItems((items) => [...items, item]);
    setShowAdd(false);
  }

  function handleSelection(item) {
    setSelectedFriends((select) => (select.id === item.id ? "" : item));
    setShowAdd(false);
  }

  function handleSplitBill(value) {
    console.log(value);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          items={items}
          selectedFriends={selectedFriends}
          onSelection={handleSelection}
        />
        {showAdd && <FormAddFriend onFriendFunc={addFriendFunc} />}
        <Button onClick={() => setShowAdd(!showAdd)}>
          {!showAdd ? "Add friend" : "Close"}
        </Button>
      </div>
      {selectedFriends && (
        <FormSplitBill
          selectedFriends={selectedFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;

function FriendsList({ items, onSelection, selectedFriends }) {
  return (
    <div>
      {items.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriends={selectedFriends}
        />
      ))}
    </div>
  );
}

function Friend({ friend, onSelection, selectedFriends }) {
  const isSeleceted = selectedFriends.id === friend.id;
  return (
    <li className={isSeleceted ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSeleceted ? "close" : "select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onFriendFunc }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=933372");
  const id = crypto.randomUUID();
  function handleSubmit(e) {
    if (!name || !image) return;

    e.preventDefault();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onFriendFunc(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=933372");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌆Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaing, setWhoIsPaing] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name}</h2>
      <label>💵 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value),
          )
        }
      />

      <label>🧑🏻‍🤝‍🧑🏼{selectedFriends.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaing}
        onChange={(e) => setWhoIsPaing(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
