import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';

const GYM_EQUIPMENT = [
  { name: 'Cardio Zone', percentage: 40, subcategories: ['Treadmills', 'Ellipticals', 'Stationary Bikes', 'Stair Climbers'] },
  { name: 'Functional Training', percentage: 30, subcategories: ['Free Weights', 'Resistance Bands', 'Kettlebells', 'TRX'] },
  { name: 'Strength Training', percentage: 12, subcategories: ['Weight Machines', 'Squat Racks', 'Bench Press'] },
  { name: 'Group Fitness', percentage: 12, subcategories: ['Yoga Studio', 'Spin Class Room', 'Aerobics Room'] },
  { name: 'Amenities', percentage: 8, subcategories: ['Locker Rooms', 'Showers', 'Sauna'] },
];

const ResultsPage = () => {
  const { t } = useLanguage();
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
      setError(t('venueInformationMissing'));
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

      const response = await fetch(`${apiUrl}?${params}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.status === 'OK') {
        setTrafficData(data);
        setError(null);
      } else if (data.status === 'Error' && data.message) {
        setError(t('Venue found, but could not forecast this venue. Potential issues: This place is too new, or not does not have enough volume (visitors) to make a forecast.'));
      } else {
        throw new Error(t('failedToFetchData'));
      }
    } catch (err) {
      setError(err.message || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }, [location.search, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

const getCurrentDayData = () => {
  if (!trafficData || !trafficData.analysis) return null;

  const gymTimezone = trafficData.venue_info.venue_timezone || 'Europe/Amsterdam';
  const currentLocalTime = new Date().toLocaleString('en-US', { timeZone: gymTimezone });
  const currentDay = new Date(currentLocalTime).getDay();
  const dayData = trafficData.analysis[currentDay].day_raw;
  
  const currentHour = new Date(currentLocalTime).getHours();
  
  // Create the chart data array with 24 hours
  const chartData = dayData.map((value, index) => {
    const hour = (index + 6) % 24; // Shift by 6 hours, wrapping around at 24
    return {
      hour: hour,
      traffic: value,
      label: `${hour.toString().padStart(2, '0')}:00`,
      isCurrentHour: hour === currentHour
    };
  });

  // Sort the data to ensure it's in order from 00:00 to 23:00
  chartData.sort((a, b) => a.hour - b.hour);

  return chartData;
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

    return (
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{t('Gym Information')}</h2>
        <p><strong>{t('Name')}:</strong> {venue_name}</p>
        <p><strong>{t('Address')}:</strong> {venue_address}</p>
        <p><strong>{t('Timezone')}:</strong> {venue_timezone}</p>
      </div>
    );
  };

  const getCurrentTrafficPercentage = () => {
    if (!trafficData || !trafficData.analysis) return 0;
    const currentHour = new Date().getHours();
    const currentDayData = getCurrentDayData();
    return currentDayData ? currentDayData.find(data => data.hour === currentHour)?.traffic || 0 : 0;
  };

const renderEquipmentUsageCards = () => {
  const currentTrafficPercentage = getCurrentTrafficPercentage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {GYM_EQUIPMENT.map((equipment, index) => {
        const usage = (equipment.percentage / 100) * currentTrafficPercentage;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 relative">
            <h3 className="text-sm font-semibold mb-1">{t(equipment.name)}</h3>
            <p className="text-2xl font-bold text-blue-600">{usage.toFixed(1)}%</p>
            <div className="absolute top-1 right-1 group">
              <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              <div className="hidden group-hover:block absolute right-0 w-40 p-2 bg-white border rounded shadow-lg z-10 text-xs">
                <ul className="list-disc pl-3">
                  {equipment.subcategories.map((sub, idx) => (
                    <li key={idx}>{t(sub)}</li>
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
    const currentDay = new Date().getDay();
    const currentDayData = trafficData.analysis[currentDay];
    if (!currentDayData || !currentDayData.surge_hours) return null;

    const { most_people_come, most_people_leave } = currentDayData.surge_hours;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">{t('Surge Hours')}</h3>
        <p>{t('Most People Arrive')}: {most_people_come}:00</p>
        <p>{t('Most People Leave')}: {most_people_leave}:00</p>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-600">{t('loadingTrafficData')}</div>;
    }

    if (error) {
      return <div className="text-center text-red-500 mb-4">{error}</div>;
    }

    if (!trafficData) {
      return <div className="text-center text-gray-600">{t('noDataAvailable')}</div>;
    }

    return (
      <>
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
          {trafficData.venue_info.venue_name} {t('trafficInformation')}
        </h1>
        {renderVenueInfo()}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t('Gym Equipment Usage')}
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              {t('live')}
            </span>
          </h2>
          {renderEquipmentUsageCards()}
        </div>
        {renderSurgeHoursCard()}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t('TodaysPopularVisitingHours')}</h2>
          {renderForecastChart()}
        </div>
      </>
    );
  };

  return (
    <Layout wide>
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; {t('Back To Search')}
        </button>
      </div>
      
      {loading && (
        <div className="text-center text-gray-600">{t('loadingTrafficData')}</div>
      )}

      {error && (
        <div className="text-center text-red-500 mb-6">{error}</div>
      )}

      {trafficData && !loading && !error && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-blue-600">{trafficData.venue_info.venue_name} {t('')}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {renderVenueInfo()}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t('Gym Equipment Usage')}
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    {t('live')}
                  </span>
                </h2>
                {renderEquipmentUsageCards()}
              </div>
              {renderSurgeHoursCard()}
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">{t('Todays Popular Visiting Hours')}</h2>
              <div className="h-96">
                {renderForecastChart()}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ResultsPage;