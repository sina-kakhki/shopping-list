import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "./List";
import { v4 as uuidv4 } from "uuid";
import addIcon from "./../images/add.png";

const baseUrl =
  "https://yyd2hz04yf.execute-api.ap-southeast-2.amazonaws.com/prod/lists";

function ShoppingLists() {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    getLists();
  }, []);

  const getLists = () => {
    axios.get(baseUrl).then((response) => {
      const listData = response.data;
      setLists(listData);
    });
  };

  const addList = async () => {
    const newTitle = prompt("Please enter list name");
    newTitle && (await axios.post(baseUrl, { title: newTitle, id: uuidv4() }));
    getLists();
  };

  const updateListTitle = async (id, newTitle) => {
    await axios.patch(baseUrl, {
      id: id,
      updateKey: "title",
      updateValue: newTitle,
    });
    getLists();
  };

  const deleteList = async (id) => {
    await axios.delete(baseUrl, { data: { id: id } });
    getLists();
  };

  return (
    <div className='p-4'>
      <div className='flex justify-between mb-4'>
        <h1 className='font-bold text-2xl text-center'>Shopping Lists</h1>
        <button className='px-2 focus:outline-none' onClick={addList}>
          <img src={addIcon} alt='add list icon' width='15' />
        </button>
      </div>
      {lists.map((list) => {
        return (
          <List
            key={list.id}
            list={list}
            updateListTitle={updateListTitle}
            deleteList={deleteList}
          />
        );
      })}
    </div>
  );
}

export default ShoppingLists;
