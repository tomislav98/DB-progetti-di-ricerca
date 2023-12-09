import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MyCalendar } from '../../Components/MainPage/Admin/AdminCalendar';
import { Card, Chip } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';

export function SimpleWindowCard({ id, date_start, date_end }) {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(getTimeRemaining());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getTimeRemaining() {
        const now = dayjs();
        const startDate = dayjs(date_start);

        const duration = startDate.diff(now);
        const days = Math.floor(duration / (24 * 60 * 60 * 1000));
        const hours = Math.floor((duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((duration % (60 * 1000)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card className='justify-content-around my-card' padding="lg" radius="md" style={{ maxWidth: '300px', boxShadow: 'none', cursor: 'default' }} >
                <div className='row'>
                    <p className='text-muted text-center'>Window: {id} </p>
                    <div className='col-12 mb-2' style={{ display: 'flex', justifyContent: 'center' }}>
                        <DateField
                            label="Start date"
                            value={dayjs(date_start)}
                            readOnly
                            format="DD/MM/YYYY"
                        />
                    </div>
                    <div className='col-12 mb-2' style={{ display: 'flex', justifyContent: 'center' }}>
                        <DateField
                            label="End date"
                            value={dayjs(date_end)}
                            readOnly
                            format="DD/MM/YYYY"
                        />
                    </div>
                    <div className='col-12 mb-2' style={{ display: 'flex', justifyContent: 'center' }}>
                        <Chip label={timeRemaining} />
                    </div>
                </div>
            </Card>
        </LocalizationProvider>
    );
}
