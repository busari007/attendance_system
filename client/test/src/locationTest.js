import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Connect to the Socket.io server

function Location() {
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLongitude] = useState(null);
    // const [altitude, setAltitude] = useState(null);
    // const [distance, setDistance] = useState(null);
    // const [boundaryWidth, setBoundaryWidth] = useState(5); // Default width
    // const [boundaryHeight, setBoundaryHeight] = useState(5); // Default height

    // const DEFAULT_ALTITUDE = 0; // Default altitude (height of the ground floor)
    // const BOUNDARY_ALTITUDE = 0; // Altitude of the boundary (adjust as needed)
    // const MAX_DISTANCE = 100000; // Maximum distance to the boundary in meters

    // const getLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setLatitude(position.coords.latitude);
    //                 setLongitude(position.coords.longitude);
    //                 if ('altitude' in position.coords && position.coords.altitude !== null) {
    //                     setAltitude(position.coords.altitude);
    //                 } else {
    //                     setAltitude(DEFAULT_ALTITUDE);
    //                 }
    //             },
    //             (error) => {
    //                 console.error('Error getting geolocation:', error);
    //             }
    //         );
    //     } else {
    //         console.error('Geolocation is not supported by this browser.');
    //     }
    // };

    // useEffect(() => {
    //     getLocation();
    // }, []);

    // const calculateDistance = (lat1, lon1, alt1, lat2, lon2, alt2) => {
    //     if (lat1 && lon1 && alt1 !== null && lat2 && lon2 && alt2 !== null) {
    //         const R = 6371; // Radius of the earth in km
    //         const dLat = deg2rad(lat2 - lat1);
    //         const dLon = deg2rad(lon2 - lon1);
    //         const dAlt = alt2 - alt1;
    //         const a =
    //             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //             Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    //             Math.sin(dLon / 2) * Math.sin(dLon / 2);
    //         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //         const distance2D = R * c; // 2D Distance in km
    //         const distance3D = Math.sqrt(Math.pow(distance2D, 2) + Math.pow(dAlt, 2)); // 3D Distance
    //         return distance3D * 1000; // Distance in meters
    //     } else {
    //         return null;
    //     }
    // };

    // const deg2rad = (deg) => {
    //     return deg * (Math.PI / 180);
    // };

    // const handleBoundaryWidthChange = (event) => {
    //     const newWidth = parseFloat(event.target.value);
    //     setBoundaryWidth(newWidth);
    //     updateBoundaryDimensions(newWidth, boundaryHeight);
    // };

    // const handleBoundaryHeightChange = (event) => {
    //     const newHeight = parseFloat(event.target.value);
    //     setBoundaryHeight(newHeight);
    //     updateBoundaryDimensions(boundaryWidth, newHeight);
    // };

    // // Function to send updated boundary dimensions to the server
    // const updateBoundaryDimensions = (width, height) => {
    //     socket.emit('updateBoundaryDimensions', { width, height });
    // };

    // useEffect(() => {
    //     if (latitude && longitude && altitude !== null) {
    //         // Calculate the coordinates of the boundary based on the user's location
    //         const boundaryCoordinates = [
    //             { latitude: latitude + boundaryWidth / 2, longitude: longitude + boundaryHeight / 2 },
    //             { latitude: latitude + boundaryWidth / 2, longitude: longitude - boundaryHeight / 2 },
    //             { latitude: latitude - boundaryWidth / 2, longitude: longitude - boundaryHeight / 2 },
    //             { latitude: latitude - boundaryWidth / 2, longitude: longitude + boundaryHeight / 2 }
    //         ];

    //         // Calculate the distance from the user's location to each boundary coordinate
    //         const distancesToBoundary = boundaryCoordinates.map(coord =>
    //             calculateDistance(latitude, longitude, altitude, coord.latitude, coord.longitude, BOUNDARY_ALTITUDE)
    //         );

    //         // Find the minimum distance among all distances to the boundary
    //         const minDistanceToBoundary = Math.min(...distancesToBoundary);

    //         // Update the distance state variable
    //         setDistance(minDistanceToBoundary);
    //     }
    // }, [latitude, longitude, altitude, boundaryWidth, boundaryHeight]);

    // useEffect(() => {
    //     // Effect to listen for boundary dimensions updates from the server
    //     socket.on('boundaryDimensions', (dimensions) => {
    //         setBoundaryWidth(dimensions.width);
    //         setBoundaryHeight(dimensions.height);
    //     });

    //     return () => {
    //         // Clean up event listener and disconnect socket
    //         socket.off('boundaryDimensions');
    //         socket.disconnect();
    //     };
    // }, []);

    return (
        <div>
            <h1>Location Information</h1>
            {/* <p>Input Boundary Dimensions:</p>
            <label>
                Width (m):
                <input type="number" value={boundaryWidth} onChange={handleBoundaryWidthChange} />
            </label>
            <br />
            <label>
                Height (m):
                <input type="number" value={boundaryHeight} onChange={handleBoundaryHeightChange} />
            </label>
            <br />
            {latitude && <p>Latitude: {latitude}</p>}
            {longitude && <p>Longitude: {longitude}</p>}
            {altitude !== null && <p>Altitude: {altitude} meters</p>}
            {distance !== null && (
                <p>
                    Distance to Classroom Boundary is: {distance} meters
                    {distance <= MAX_DISTANCE ? <span> - Within specified distance</span> : <span> - Outside specified distance</span>}
                </p> 
            )} */}
        </div>
    );
}

export default Location;
