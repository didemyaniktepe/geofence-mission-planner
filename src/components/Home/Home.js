import React from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Geofence from "../Geofence/Geofences";
import "./home.css";
import {MapContainer, TileLayer} from "react-leaflet";


const Home = () => {


    return (
        <div>
            <h1 className="modern-heading">Geofence Mission Planner</h1>
            <MapContainer center={[51.505, -0.09]}
                          zoom={13}
                          style={{height: '500px'}}>
                <Geofence/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
            <ToastContainer/>
        </div>
    );
}
export default Home;