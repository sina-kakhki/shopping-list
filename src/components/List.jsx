import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import ListItem from "./ListItem";
import AddItem from "./AddItem";
import deleteIcon from "./../images/delete.png";
import updateIcon from "./../images/update.png";

const itemsUrl =
  "https://yyd2hz04yf.execute-api.ap-southeast-2.amazonaws.com/prod/items";

function List(props) {
  const { id, title } = props.list;
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
    // eslint-disable-next-line
  }, []);
  

  const getItems = () => {
    axios.get(itemsUrl, { params: { listId: id } }).then((response) => {
      const itemsData = response.data;
      setItems(itemsData);
    });
  };

  const addItem = async (newItem) => {
    await axios.post(itemsUrl, { id: uuidv4(), listId: id, item: newItem });
    getItems();
  };

  const updateList = () => {
    const newTitle = prompt("Please enter list name");
    newTitle && props.updateListTitle(id, newTitle);
  };

  return (
    <>
      <div className='flex mt-4'>
        <h2 className='italic text-blue-500 text-xl mr-2'>{title}</h2>
        <button className='px-2 focus:outline-none' onClick={updateList}>
          <img src={updateIcon} alt='update icon' width='15' />
        </button>
        <button
          className='focus:outline-none'
          onClick={() => props.deleteList(id)}
        >
          <img src={deleteIcon} alt='delete icon' width='15' />
        </button>
      </div>
      <ul className=''>
        {items.map((item) => {
          return <ListItem key={item.id} item={item} />;
        })}
      </ul>
      <AddItem addItem={addItem} />
    </>
  );
}

export default List;
