import { Container, Table } from "react-bootstrap";
import fb from "../../Firebase";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SettingsCellRounded } from "@material-ui/icons";
// import { request } from 'express';

function LiveRequest(props) {
    const [liveRequests, setRequest] = useState(null);

    useEffect(() => {
        console.log(props.name)
        const interval = setInterval(() => {
            const fetchData = async () => {
                const liveRequest = await axios.get(
                    `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${props.name}/liverequest`
                    // http://localhost:5001/restaurantqr-73126/us-central1/api/
            
                    );
                    const requestData = liveRequest.data.tables;
                    setRequest(requestData);
            }
            fetchData();
        },10000);
        return () => clearInterval(interval);
        
    }, []);

    return (
        <div>
            <Container fluid>{getRow(liveRequests,props.name)}</Container>
        </div>
    );
}

function getRow(tableRequests,name) {
    // console.log("tableRequests");
    //converting {object: {object: object}} to
    // array [tablenumber, [table request]]
    const doneWithTask = (event) => {
        removeData(tableRequests, event);
    }
    if (tableRequests != null) {
        // console.log(tableRequests);
        const arrTables = Object.keys(tableRequests).map((key, val) => {
        // console.log(`key: ${key} | val: ${tableRequests[key].requests}`);
        return [key, tableRequests[key].requests];
        });
        // console.log("array");
        // console.log(arrTables);
        return (
        <div>
            <Table striped>
                <thead>
                    <tr>
                    <th>Table</th>
                    <th>Request</th>
                    <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {arrTables.map((table, indx) =>
                    arrTables[indx][1].map((item) => (
                        <tr id="request-row" name={name} table={arrTables[indx][0]} item={item} key={arrTables[indx][0]+ item} onClick={doneWithTask}>
                            <th>{arrTables[indx][0]}</th>
                            <th>{item}</th>
                            <th>12:00pm</th>
                        </tr>
                    ))
                    )}
                </tbody>
            </Table>
        </div>
        );
    }
    else ;
    return <h2>loading...</h2>;
}

async function removeData(requests, e) {
    console.log("requests");
    // console.log(requests);

    let element = e.target.closest("#request-row");
    let table = (element.getAttribute("table"));
    let item = (element.getAttribute("item"));
    let name = (element.getAttribute("name"));
    let removeItem = (requests[table].requests.filter(i => {
        return i == item;
    })[0]);


    if(requests[table].requests.indexOf(removeItem) >= 0)
        requests[table].requests.splice(requests[table].requests.indexOf(removeItem),1);
    // console.log(requests);

    const objectsToAxios = {
        newRequest : requests
    }

    await axios.put(
        // `https://us-central1-restaurantqr-73126.cloudfunctions.net/api/${name}/deleterequest/${table}`,
        `http://localhost:5001/restaurantqr-73126/us-central1/api/${name}/deleterequest/${table}`,
        objectsToAxios
    );


}
export default LiveRequest;
