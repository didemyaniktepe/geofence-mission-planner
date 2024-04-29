import {Marker, Polygon, useMapEvents} from "react-leaflet";
import { useState, useEffect } from "react";

const Markers = (props) => {
    const [initialPosition, setInitialPosition] = useState([0,0]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);

        });
    }, []);



    return (
        <>
            {selectedPolygon &&
                <Marker positions={selectedPolygon['coordinates']} pathOptions={{color: 'yellow'}}/>
            }
        </>
    );
};

export default Markers;