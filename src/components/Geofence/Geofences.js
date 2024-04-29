import {FeatureGroup, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {EditControl} from "react-leaflet-draw";
import React, {useEffect, useState} from "react";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {polygon, booleanPointInPolygon} from '@turf/turf';

const Geofence = () => {

    const [initialPosition, setInitialPosition] = useState([0, 0]);
    const [selectedPolygon, setSelectedPolygon] = useState(null);
    const [geofences, setGeofences] = useState([]);
    const [selectedGeofence, setSelectedGeofence] = useState(null);
    const [isMarker, setIsMarker] = useState(false);
    let prevSelectedGeofence = null;




    useMap();
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);

        });
    }, []);

    const handleClick = (e) => {
        const pointCoords = [e.latlng.lat, e.latlng.lng];
        console.log("isMarker", isMarker);
        console.log("handle click",e)
        if (!isMarker) {
            for (let i = 0; i < geofences.length; i++) {
                if (isPointInsideGeofence(pointCoords, getCoordinates(i))) {
                    setSelectedGeofence(() => {
                        return geofences[i]
                    });
                    setSelectedPolygon(() => geofences[i]);
                    prevSelectedGeofence = geofences[i];
                    toast.info("Geofence selected")
                    return
                }
            }
        }
        setSelectedPolygon(null);
    }

    function getSelectedGeofence() {
        console.log("48", prevSelectedGeofence)
        return prevSelectedGeofence;
    }

    const map = useMapEvents({
        click: handleClick
    });


    const isPointInsideGeofence = (marker, coordinates) => {
        const turfCoordinates = convertToTurfCoordinates(coordinates);
        const tPolygon = polygon(turfCoordinates);
        return booleanPointInPolygon(marker, tPolygon);
    }

    const onCreated = (e) => {
        const {layer, layerType} = e;
        const {_leaflet_id} = layer;
        if (layerType === "polygon") {
            const geofence = {
                polygonId: _leaflet_id,
                coordinates: e.layer.editing.latlngs[0],
            };
            setGeofences((prevGeofences) => [geofence, ...prevGeofences]);
            toast.success("Geofence Created!");
        }

        if (layerType === "marker") {
            let x = getSelectedGeofence()
            console.log("x", x)
            if (selectedGeofence === null) {
                toast.error("Please select a Geofence first");
                map.removeLayer(layer);
                return;
            }

            if (isPointInsideGeofence(e.layer.getLatLng(), selectedGeofence?.coordinates)) {
                toast.error("Marker is inside Geofence");

            }
        }
    };

    const onEdited = (e) => {
        const {layers: {_layers}} = e;

        for (const layerId in _layers) {
            const layer = _layers[layerId];
            const {_leaflet_id, editing} = layer;

            setGeofences((layers) => {
                return layers.map((l) => {
                    if (l.polygonId === _leaflet_id) {
                        return {...l, latlngs: {...editing.latlngs[0]}};
                    } else {
                        return l;
                    }
                });
            });
        }

        toast.success("Geofence Edited!");
    };

    const onDelete = (e) => {
        const {layers: {_layers}} = e;

        const leafletIds = Object.values(_layers).map(({_leaflet_id}) => _leaflet_id);
        setGeofences((geofences) =>
            geofences.filter((geofence) => !leafletIds.includes(geofence.polygonId))
        );

        toast.success("Geofence Deleted!");
    };


    const onDrawStart = (e) => {
        const {layerType} = e;

        if (layerType === "marker") {
            setIsMarker(true);
        } else {
            setIsMarker(false)
        }
    }

    const onDrawStop = (e) => {
        setIsMarker(false);
    }

    function getCoordinates(i) {
        let coordinates = geofences[i]['coordinates'];
        if (coordinates[0][0] !== coordinates[0][coordinates[0].length - 1]) {
            coordinates[0].push(coordinates[0][0]);
        }
        return coordinates;
    }

    function convertToTurfCoordinates(coordinates) {
        return coordinates.map(ring =>
            ring.map(latlng => [latlng.lat, latlng.lng])
        );
    }


    return (
        <>
            {selectedPolygon &&
                <Polygon positions={selectedPolygon['coordinates']} pathOptions={{color: 'yellow'}}/>
            }
            <FeatureGroup>
                <EditControl
                    position="topleft"
                    onCreated={onCreated}
                    onEdited={onEdited}
                    onDelete={onDelete}
                    onDrawStart={onDrawStart}
                    onDrawStop={onDrawStop}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        polyline: false,
                        marker: true,
                    }}
                />
            </FeatureGroup>
        </>
    )

}

export default Geofence;