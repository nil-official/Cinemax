import { colors } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = ({x, y}) => {
    const state = {
        options: {
            chart: {
                type: 'area',
                height: 300
            },
            xaxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
                categories: x
            },

        },
        series: [
            {
                name: 'Sales',
                // data: [30, 40, 35, 50, 49, 60, 70]
                data: y
            }
        ]
    };

    return (
        <div>
            <Chart options={state.options} series={state.series} type="area" height={300} />
        </div>
    );
};

export default RevenueChart;