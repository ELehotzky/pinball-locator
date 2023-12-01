"use client";

import { useState } from 'react';

export default function Home() {
    const [location, setLocation] = useState({ latitude: "", longitude: "" });
    const [results, setResults] = useState<any[]>([]);
  
    const getUserLocation = () => {
        // https://www.w3schools.com/js/js_api_geolocation.asp
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(setUserLocation);
        }
    };
  
    const setUserLocation = (position: GeolocationPosition) => {
        setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
        });
    };
  
    const handleInput = (event: any) => {
      const { name, value } = event.target;
      setLocation({ ...location, [name]: value.toString() });
    };
    
    async function getMachines() {
        const latitude = location["latitude"];
        const longitude = location["longitude"];
        const URL = `https://pinballmap.com/api/v1/locations/closest_by_lat_lon.json?lat=${latitude}&lon=${longitude}`;
        try {
            const resp = await fetch(URL);
            const data = await resp.json();
            if (data.location) {
                setResults([].concat(data.location));
            }
        }
        catch (error) {
            throw(error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-3xl bold">Pinball Locator</h1>
            <h3>Input your latitude/longitude and hit Search, or use "Near Me" to automatically input your coordinates.</h3>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                        Latitude
                </label>
                <input
                    name="latitude"
                    className="block text-gray-700 text-sm font-bold mb-2 border"
                    placeholder="00.0000000"                    
                    value={location["latitude"]}
                    onChange={handleInput}
                ></input>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                        Longitude
                </label>
                <input
                    name="longitude"
                    className="block text-gray-700 text-sm font-bold mb-2 border"
                    placeholder="-00.0000000"                    
                    value={location["longitude"]}
                    onChange={handleInput}
                ></input>
            </div>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={getUserLocation}>Near Me</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={getMachines}>Search</button>
            </div>
            {/* <ResultsList /> */}
           
            <div className="results">
                <ul key='results'>
                {results.map((result) => (
                        <div className="max-w-sm w-full lg:max-w-full lg:flex">
                        <div className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" title="Woman holding a mug">
                        </div>
                        <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                            <div className="mb-8">
                            <div className="text-gray-900 font-bold text-xl mb-2">{result["name"]}</div>
                            <p className="text-gray-900 mb-2 leading-none">{result["description"]}</p>
                                {result["machine_names"].map((machine: string) => {
                                    return <li key={machine} className="text-gray-700 text-base">* {machine}</li>
                                })}
                            </div>
                            <div className="flex items-center">
                            <div className="text-sm">
                                <p className="text-gray-900 leading-none">{result["city"]}</p>
                                <p className="text-gray-900 leading-none">Distance: {result["distance"].toFixed(2)} miles</p>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}
                </ul>
            </div>
      </main>
    );
}