import React from "react";

function ListItem(props) {
  const { item } = props.item;
  return <li className='list-disc list-inside'>{item}</li>;
}

export default ListItem;
