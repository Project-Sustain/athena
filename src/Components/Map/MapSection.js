import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

export function MapSection(props) {

    // const map = useMap();

    return (

        <MapContainer center={[51.505, -0.09]} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
             <Marker position={[51.505, -0.09]}>
                 <Popup>
                     A pretty CSS3 popup. <br/> Easily customizable.
                 </Popup>
             </Marker>
        </MapContainer>
    );

}