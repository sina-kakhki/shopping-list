import React, { useState } from "react";

function AddItem(props) {
  const [newItem, setNewItem] = useState("");

  function handleChange(e) {
    setNewItem(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.addItem(newItem);
    setNewItem("");
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name='new-item'
          value={newItem}
          onChange={handleChange}
          className='px-2 mt-2 rounded border-2'
          placeholder='Add item'
          autoFocus={true}
        />
      </form>
    </div>
  );
}

export default AddItem;
