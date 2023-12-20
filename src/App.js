import { useState } from "react";

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
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [newFriend, setNewFriend] = useState(false);
  const [selected, setSelected] = useState(null);

  function handleNewFriend() {
    setNewFriend((friend) => !friend);
  }

  function handleInputFriend(newInputfriend) {
    setFriendList((inputFriend) => [...inputFriend, newInputfriend]);
  }

  function handleSelectedFriend(selectedFriend) {
    setSelected((cur) =>
      cur?.id === selectedFriend?.id ? null : selectedFriend
    );
    setNewFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          onHandleSelected={handleSelectedFriend}
          selected={selected}
        />
        {newFriend && <NewFriend onInputFriend={handleInputFriend} />}
        <Button onClick={handleNewFriend}>
          {newFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selected && (
        <SplitBill selected={selected} onHandleSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, onHandleSelected, selected }) {
  return (
    <ul>
      {friends.map((val) => (
        <Friend
          friend={val}
          key={val.id}
          onHandleSelected={onHandleSelected}
          selected={selected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onHandleSelected, selected }) {
  const isSelected = selected?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance === 0 && <p>you and {friend.name} are even</p>}

      <Button onClick={() => onHandleSelected(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function NewFriend({ onInputFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();

    const friendData = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onInputFriend(friendData);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function SplitBill({ selected, onHandleSplitBill }) {
  const [bill, SetBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onHandleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selected.name}</h2>
      <label>💸Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => SetBill(+e.target.value)}
      />

      <label>💸Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>💸{selected.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>💸Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
      </select>
    </form>
  );
}
