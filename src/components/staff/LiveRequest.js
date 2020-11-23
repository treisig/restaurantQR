import { Container, Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

function LiveRequest(props) {
  const [liveRequests, setRequest] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log(props.name);
    if (props.name) {
      console.log(props.name);
      const interval = setInterval(() => {
        const fetchData = async () => {
          const liveRequest = await axios.get(
            `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${props.name}/staff/liverequest`
            // http://localhost:5001/restaurantqr-73126/us-central1/api/
          );
          const requestData = liveRequest.data.tables;
          setRequest(requestData);
        };
        fetchData();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [props]);
  useEffect(() => {
    if (props.name) {
      const fetchData = async () => {
        const liveRequest = await axios.get(
          `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${props.name}/staff/liverequest`
          // http://localhost:5001/restaurantqr-73126/us-central1/api/
        );
        const requestData = liveRequest.data.tables;
        setRequest(requestData);
      };
      fetchData();
    }
  }, [props, counter]);
  const removeData = async (requests, e) => {
    let element = e.target.closest("#request-row");
    let table = element.getAttribute("table");
    let item = element.getAttribute("item");
    let name = element.getAttribute("name");
    console.log(item);
    console.log(item[1]);

    let removeItem = requests[table].requests.filter((i) => {
      // console.log(i);
      return i.item !== item;
    });

    // if (requests[table].requests.indexOf(removeItem) >= 0)
    //   requests[table].requests.splice(
    //     requests[table].requests.indexOf(removeItem),
    //     1
    //   );
    const objectsToAxios = {
      newRequest: removeItem,
    };
    await axios.put(
      // `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${name}/deleterequest/${table}`,
      `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${name}/deleterequest/${table}`,
      // `http://localhost:5001/restaurantqr-73126/us-central1/api/${name}/deleterequest/${table}`,

      objectsToAxios
    );
    setCounter(counter + 1);
  };
  const getLiveRequestTableRow = (tableRequests, name) => {
    const doneWithTask = (event) => {
      removeData(tableRequests, event);
    };
    if (tableRequests != null) {
      let arrTables = [];
      Object.keys(tableRequests).map((key, indx) => {
        if (
          tableRequests[key].requests &&
          tableRequests[key].requests.length > 0
        ) {
          tableRequests[key].requests.map((item) => {
            return arrTables.push([
              item["time"],
              { item: item["item"], table: key },
            ]);
          });
        }
      });
      arrTables.sort((a, b) => b[0] - a[0]);
      return (
        <Table striped className="tables-accordion">
          <thead>
            <tr className="center">
              <th>Table</th>
              <th>Request</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {arrTables.map((item, indx) => {
              return (
                <tr
                  id="request-row"
                  name={name}
                  table={item[1].table}
                  item={item[1].item}
                  key={item[1].table + item[1].item + item[0]}
                  onClick={doneWithTask}
                >
                  <td>{item[1].table}</td>
                  <td>{item[1].item}</td>
                  <td>
                    {new Date(arrTables[indx][0] * 1000)
                      .toLocaleTimeString("en-US")
                      .toString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      );
    } else;
    return <h2>loading...</h2>;
  };
  return (
    <Container fluid className="liverequest-table">
      {getLiveRequestTableRow(liveRequests, props.name)}
    </Container>
  );
}
export default LiveRequest;
