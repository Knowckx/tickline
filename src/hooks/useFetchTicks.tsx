import { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticks } from '../types/tick';

// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://192.168.3.6:8000";

const useFetchTicks = (sid: string, useDay: string) => {
    const [ticksData, setTicksData] = useState<Ticks | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            let response;
            const qUrl = `${BASE_URL}/tick/${sid}/${useDay}`
            try {
                response = await axios.get<Ticks>(qUrl);
                setTicksData(response.data);
            } catch (err: any) {
                const errMsg = `${qUrl}  |  ${err.message}  |  ${response}`
                setError(errMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sid, useDay]);

    return { ticksData, loading, error };
};

export default useFetchTicks;