import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import {useEffect, useState} from "react";
import {mongoQuery} from "./../Utils/Download.ts";


export function MapSection(props) {

    const position = [40.573733, -105.086559]
    const [geoData, setGeoData] = useState({});

    useEffect(() => {
        (async () => {
            const geoData = await mongoQuery("county_geo_30mb_no_2d_index", []); // play around with other collection to see if it can be used. It is faster
            if(geoData){
                console.log({geoData})
                setGeoData(geoData)
            }
            else {
                console.log("API call failure, data unavailable");
            }
        })();
    }, []);


    const mapStyle = {
        height: '100vh',
        width: '100%',
        margin: '0 auto',
    }

    console.log({geoData})

    return (

        <MapContainer center={position} zoom={11} style={mapStyle}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

            />
        </MapContainer>
    );

}