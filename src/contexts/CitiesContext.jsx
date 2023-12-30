import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback
} from 'react';
import PropTypes from 'prop-types';

// const BASE_URL = 'http://localhost:9000';
const BASE_URL = 'https://worldwise-server-0o39.onrender.com';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      console.log('Cities loaded:', action.payload);
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {}
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
        //setCities(data);
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading cities data...'
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: 'loading' });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: 'city/loaded', payload: data });
        // setCurrentCity(data);
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading city data...'
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
      // setCities((cities) => [...cities, data]);
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error posting new city data...'
      });
      // alert('There was an error posting new city data...');
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE'
      });
      dispatch({ type: 'city/deleted', payload: id });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting the city...'
      });
      //alert('There was an error deleting the city...');
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was used outside the CitiesProvider');
  return context;
}

CitiesProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { CitiesProvider, useCities };
