import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Weather from "./components/Weather";
import WorldMap from "./components/WorldMap";
import useLocalStorage from "./hooks/useLocalStorage";

// styles
import './styles/index.css';
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
    const [, setLocation] = useLocalStorage("location", "");
    // eslint-disable-next-line
    const [active, setActive] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState({});
    // eslint-disable-next-line
    const [errorMessage, setErrorMessage] = useState('');
    // eslint-disable-next-line
    const [stateLocation, setStateLocation] = useState({});
    const [search_query, setSearchQuery] = useState('');
    const hasRequestedLocation = useRef(false);

    const showError = useCallback((error: GeolocationPositionError) => {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          setActive(true);
          setError(true);
          setErrorMessage('PERMISSION_DENIED');
        break;
        case error.POSITION_UNAVAILABLE:
          setActive(true);
          setError(true);
          setErrorMessage('POSITION_UNAVAILABLE');
        break;
        case error.TIMEOUT:
          setActive(true);
          setError(true);
          setErrorMessage('TIMEOUT');
        break;
      }
    }, []);

    const search = useCallback((query: string) => {
      if (!query) {
        setActive(true);
        setError(true);
        setErrorMessage('Please enter a city name.');
        return;
      }

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com',
          'X-RapidAPI-Key': '346e928ab2mshca7bcbe7ff1773ap13a0c4jsn9f67b8b5e23f'
        }
      };

      fetch(`https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${encodeURIComponent(query)}&contentType=json&unitGroup=us&shortColumnNames=0&iconSet=icons1`, options)
        .then(res => res.json())
        .then(json_ => {
          const hasWeatherData =
            json_ &&
            typeof json_ === 'object' &&
            json_.locations &&
            Object.keys(json_.locations).length > 0;

          if (!hasWeatherData) {
            setActive(true);
            setError(true);
            setErrorMessage(json_?.message || 'Unable to load weather data right now.');
            return;
          }

          setError(false);
          setActive(true);
          setErrorMessage('');
          setData(json_);
        })
        .catch(() => {
          setActive(true);
          setError(true);
          setErrorMessage('Unable to load weather data right now.');
      });
    }, []);
  
    const showPosition = useCallback((position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const currentGeolocation = `${latitude},${longitude}`;

      fetch(`https://www.mapquestapi.com/geocoding/v1/reverse?key=aC8YRLAkjWFFgDtxI4lXTIbtAklLvX6E&location=${encodeURIComponent(currentGeolocation)}&includeRoadMetadata=true&includeNearestIntersection=true`)
        .then(res => res.json())
        .then(json => {
          const resolvedLocation = json.results[0].locations[0];
          const city = resolvedLocation?.adminArea5 || resolvedLocation?.adminArea3 || currentGeolocation;

          setStateLocation(resolvedLocation);
          setLocation(city);
          search(city);
        })
        .catch((e) => {
          console.error('Something went wrong', e);
          search(currentGeolocation);
        });
    }, [search, setLocation]);

    useEffect(() => {
      if (!navigator.geolocation || hasRequestedLocation.current) {
        return;
      }

      hasRequestedLocation.current = true;
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }, [showError, showPosition]);

  return (
    <div className="App">
        <section className="weather py-8">
          <div className="sm:container sm:mx-auto px-10">
            <div className="px-20">
              <div className="header px-5">
                <div className="flex justify-between align-baseline">
                  <div className="app-logo align-baseline text-white my-auto">
                    <b className="align-baseline my-auto text-xl">Weather App</b>
                  </div>
                  <div className="app-search w-1/3">
                    <form className="flex items-center" onSubmit={(e) => {e.preventDefault(); search(search_query)}}>   
                        <label htmlFor="voice-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="voice-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your city" required onKeyUp={(e) => {setSearchQuery((e.target as HTMLInputElement).value)}} />
                            <button type="button" className="flex absolute inset-y-0 right-0 items-center pr-3">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                    </form>
                  </div>
                </div>
              </div>
              <main className="weather-container">
                <WorldMap data={data} />
                {
                  error ? 
                    <div className="status-card status-card-error">
                      <h1>{errorMessage || 'Error loading weather data.'}</h1>
                    </div>
                  : 
                    <div className="weather-data-shell">
                      { Object.keys(data).length > 0 ? <Weather data={data}/> : <div className="status-card"><Loading/></div>}
                    </div>
                }

              </main>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
  );
}

export default App;
