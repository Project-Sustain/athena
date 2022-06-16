import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import {useEffect, useState} from "react";
import {mongoQuery} from "./../Utils/Download.ts";


export function MapSection(props) {

    const position = [40.573733, -105.086559]
    const [geoData, setGeoData] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(Object.keys(geoData).length === 0);
    }, [geoData]);

    useEffect(() => {
        (async () => {
            const geoData = await mongoQuery("county_geo_30mb", []);
            if(geoData){
                setGeoData(geoData)
            }
            else {
                console.log("API call failure, data unavailable");
            }
        })();
    }, []);


    console.log({geoData})

    const mapStyle = {
        height: '100vh',
        width: '100%',
        margin: '0 auto',
    }

    if(!loading) {
        return (
            <MapContainer center={position} zoom={11} style={mapStyle}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                />
                <GeoJSON data={geoData}/>
            </MapContainer>
        );
    }
    else{
        return null;
    }
}