import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { Helmet } from 'react-helmet';

const GYM_EQUIPMENT = [
  { name: 'Cardio Zone', percentage: 40, subcategories: ['Treadmills', 'Ellipticals', 'Stationary Bikes', 'Stair Climbers'] },
  { name: 'Functional Training', percentage: 30, subcategories: ['Free Weights', 'Resistance Bands', 'Kettlebells', 'TRX'] },
  { name: 'Strength Training', percentage: 12, subcategories: ['Weight Machines', 'Squat Racks', 'Bench Press'] },
  { name: 'Group Fitness', percentage: 12, subcategories: ['Yoga Studio', 'Spin Class Room', 'Aerobics Room'] },
  { name: 'Amenities', percentage: 8, subcategories: ['Locker Rooms', 'Showers', 'Sauna'] },
];

const ResultsPage = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = useCallback(async () => {
    const searchParams = new URLSearchParams(location.search);
    const venueName = searchParams.get('name');
    const venueAddress = searchParams.get('address');

    if (!venueName || !venueAddress) {
      setError('Venue information is missing.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `https://besttime.app/api/v1/forecasts`;
      const params = new URLSearchParams({
        'api_key_private': 'pri_638bf64b8d4c4db680a3ad4657f069f1',
        'venue_name': venueName,
        'venue_address': venueAddress
      });

      console.log('Making API call to BestTime');
      console.log('Venue Name:', venueName);
      console.log('Venue Address:', venueAddress);

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'POST',
      });

      if (response.status === 404) {
        setError("Venue found, but could not forecast this venue. Potential issues: This place is too new, or not does not have enough volume (visitors) to make a forecast. If you think otherwise, please contact gymtraffic.live@gmail.com");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK') {
        setTrafficData(data);
        console.log('API call successful, data received:', data);
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


const getCurrentDayData = () => {
  if (!trafficData || !trafficData.analysis) return null;

  const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
  const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
  const currentDay = new Date(currentLocalTime).getDay();
  const dayData = trafficData.analysis[currentDay];
  
  const currentHour = new Date(currentLocalTime).getHours();
  
  // Rearrange the data to start from 00:00
  const rearrangedData = [
    ...dayData.day_raw.slice(18), // 00:00 to 05:00
    ...dayData.day_raw.slice(0, 18) // 06:00 to 23:00
  ];
  
  return rearrangedData.map((value, index) => ({
    hour: index,
    traffic: value,
    label: `${index.toString().padStart(2, '0')}:00`,
    isCurrentHour: index === currentHour
  }));
};

  const getOpeningHours = () => {
    if (!trafficData || !trafficData.analysis) return '';
    const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
    const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
    const currentDay = new Date(currentLocalTime).getDay();
    const currentDayData = trafficData.analysis[currentDay];
    if (!currentDayData || !currentDayData.day_info) return '';
    
    return currentDayData.day_info.venue_open_close_v2?.['12h'][0] || 'Hours not available';
  };

  const isGymOpen24Hours = () => {
    if (!trafficData || !trafficData.analysis) return false;
    const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
    const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
    const currentDay = new Date(currentLocalTime).getDay();
    const currentDayData = trafficData.analysis[currentDay];
    return currentDayData && currentDayData.day_info &&
           currentDayData.day_info.venue_open_close_v2?.['12h'][0] === 'Open 24 hours';
  };

  const checkIfGymOpen = () => {
    if (isGymOpen24Hours()) return true;
    
    if (!trafficData || !trafficData.analysis) return false;
    const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
    const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
    const currentDay = new Date(currentLocalTime).getDay();
    const currentDayData = trafficData.analysis[currentDay];
    if (!currentDayData || !currentDayData.day_info) return false;

    const { venue_open, venue_closed } = currentDayData.day_info;
    const currentHour = new Date(currentLocalTime).getHours();
    return currentHour >= venue_open && currentHour < venue_closed;
  };

	const renderForecastChart = () => {
	  const chartData = getCurrentDayData();
	  if (!chartData) return <p>No data available for today</p>;

	  return (
		<ResponsiveContainer width="100%" height={400}>
		  <BarChart data={chartData}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis 
			  dataKey="label" 
			  interval={1} 
			  tick={({ x, y, payload }) => (
				<g transform={`translate(${x},${y})`}>
				  <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" transform="rotate(-35)">
					{payload.value}
				  </text>
				</g>
			  )}
			/>
			<YAxis domain={[0, 100]} />
			<Tooltip formatter={(value) => `${value}%`} />
			<Bar dataKey="traffic">
			  {chartData.map((entry, index) => (
				<Cell key={`cell-${index}`} fill={entry.isCurrentHour ? '#ff0000' : '#8884d8'} />
			  ))}
			</Bar>
		  </BarChart>
		</ResponsiveContainer>
	  );
	};

  const renderVenueInfo = () => {
    if (!trafficData || !trafficData.venue_info) return null;

    const { venue_name, venue_address, venue_timezone } = trafficData.venue_info;
    const openingHours = getOpeningHours();
    const isOpen = checkIfGymOpen();

    return (
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Gym Information</h2>
        <div className="flex items-center">
          <p className="font-bold">{venue_name}</p>
          {!isOpen && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">CLOSED</span>}
        </div>
        <p><strong>Address:</strong> {venue_address}</p>
        <p><strong>Timezone:</strong> {venue_timezone}</p>
        <p><strong>Hours:</strong> {openingHours}</p>
      </div>
    );
  };

  const getCurrentTrafficPercentage = () => {
    if (!trafficData || !trafficData.analysis) return 0;
    const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
    const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
    const currentHour = new Date(currentLocalTime).getHours();
    const currentDayData = getCurrentDayData();
    return currentDayData ? currentDayData.find(data => data.hour === currentHour)?.traffic || 0 : 0;
  };

  const renderEquipmentUsageCards = () => {
    const currentTrafficPercentage = getCurrentTrafficPercentage();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {GYM_EQUIPMENT.map((equipment, index) => {
          const usage = (equipment.percentage / 100) * currentTrafficPercentage;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 relative">
              <h3 className="text-lg font-semibold mb-2">{equipment.name}</h3>
              <p className="text-3xl font-bold text-blue-600">{usage.toFixed(1)}%</p>
              <div className="absolute top-2 right-2 group">
                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                <div className="hidden group-hover:block absolute right-0 w-48 p-2 bg-white border rounded shadow-lg z-10">
                  <ul className="list-disc pl-4 text-sm">
                    {equipment.subcategories.map((sub, idx) => (
                      <li key={idx}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSurgeHoursCard = () => {
    if (!trafficData || !trafficData.analysis) return null;
    const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
    const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
    const currentDay = new Date(currentLocalTime).getDay();
    const currentDayData = trafficData.analysis[currentDay];
    if (!currentDayData || !currentDayData.surge_hours) return null;

    const { most_people_come, most_people_leave } = currentDayData.surge_hours;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Surge Hours</h3>
        <p>Most people arrive: {most_people_come}:00</p>
        <p>Most people leave: {most_people_leave}:00</p>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{trafficData ? `${trafficData.venue_info.venue_name} Traffic | Gym Occupancy` : 'Gym Traffic Results'}</title>
        <meta name="description" content={trafficData ? `Check real-time occupancy and foot traffic for ${trafficData.venue_info.venue_name} in ${trafficData.venue_info.venue_address}. Plan your workout with up-to-date crowdedness information.` : 'View gym traffic and occupancy information for fitness centers in the Netherlands.'} />
        <meta name="keywords" content={`gym traffic, ${trafficData?.venue_info.venue_name}, gym occupancy, fitness center crowdedness, Netherlands gyms, workout planning`} />
        <link rel="canonical" href={`https://www.gymtraffic.live/results?name=${encodeURIComponent(trafficData?.venue_info.venue_name || '')}&address=${encodeURIComponent(trafficData?.venue_info.venue_address || '')}`} />
      </Helmet>
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <nav>
            <button
              onClick={() => navigate('/')}
              className="mb-6 text-blue-600 hover:text-blue-800"
            >
              &larr; Back to Search
            </button>
          </nav>

          {loading && (
            <div className="text-center text-gray-600">
              <p>Loading traffic data...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 mb-4">
              <p>Error: {error}</p>
            </div>
          )}

          {trafficData && !loading && !error && (
            <article className="bg-white rounded-lg shadow-md p-6">
              <header>
                <h1 className="text-2xl font-bold mb-4">{trafficData.venue_info.venue_name} Traffic Information</h1>
              </header>
              {renderVenueInfo()}
              <section>
                <h2 className="text-xl font-semibold inline-block mr-2">Gym Equipment Usage</h2>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">LIVE</span>
                {renderEquipmentUsageCards()}
              </section>
              {renderSurgeHoursCard()}
              <section>
                <h2 className="text-xl font-semibold mb-4">Today's popular visiting hours</h2>
                {renderForecastChart()}
              </section>
            </article>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Data provided by GymTraffic.live | Contact: <a href="mailto:gymtraffic.live@gmail.com" className="text-blue-600 hover:underline">gymtraffic.live@gmail.com</a></p>
      </footer>
    </>
  );
};

export default ResultsPage;