import React, { useState, useEffect } from "react";
import "./customer.css";
import Header from "./Header.js";
import MenuItem from "./MenuItem.js";
import MenuHeaderAndBox from "./MenuHeaderAndBox.js";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";

function Menu(props) {
  // props.name == the restaurant name;
  // props.menuItems == array of menu items
  const [fullMenu, setMenu] = useState(null);
  const [itemView, setItemView] = useState(false);
  const [currentItem, setItem] = useState(null);

  useEffect(() => {
    (async function () {
      const menuRequest = await axios.get(
        "http://localhost:5001/restaurantqr-73126/us-central1/api/test_restaurant_3/menu"
      );
      const menuData = menuRequest.data.menu;
      setMenu(menuData);
      // console.log(menuData);
      // console.log(Object.entries(menuData));
    })();
  }, []);

  // Example of how async useEffect works

  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const response = await MyAPI.getData(someId);
  //     // ...
  //   }
  //   fetchData();
  // }, [someId]); // Or [] if effect doesn't need props or state

  /**
   * transistions to the menu item page
   * sets the item for itemView
   * @param {menu item object} item
   */
  const getMenuItem = (item) => {
    console.log(item);
    setItem(item);
    setItemView(true);
  };

  // sent as a prop to a menu item to change back to menu view
  const changeToMenuView = () => {
    setItemView(false);
  };

  // changes to the item view if you click on an item
  if (itemView) {
    return (
      <MenuItem
        name={props.name}
        item={currentItem}
        goBackToMenu={changeToMenuView}
      />
    );
  }
  /**
   * menuSectionObj look like this
   * header: {
   *    tacos: {
   *        description: "yo"
   *        price: 9.00
   *     },
   *     enchiladas: {
   *        description: "yo"
   *        price: 9.00
   *     },
   * }
   */

  return (
    <div>
      <Header name={"Tucker's Test Restaurant"} />
      {/* <div id="menuCardsDiv">
        {props.menuItems.map((item) => (
          <div className="itemCard" onClick={() => getMenuItem(item)}>
            <span className="itemText">{`${item.name}: ${item.description}`}</span>
          </div>
        ))}
      </div> */}
      <Accordion defaultActiveKey="0">
        {
          // makes sure the menu isn't null
          fullMenu &&
            Object.entries(fullMenu).map((menuSectionTuple, index) => (
              // maps each section and its items to a header and box
              <MenuHeaderAndBox
                sectionName={menuSectionTuple[0]}
                items={menuSectionTuple[1]}
                accID={index + 1}
                getMenuItem={getMenuItem}
              />
            ))
        }
      </Accordion>
    </div>
  );
}

export default Menu;
