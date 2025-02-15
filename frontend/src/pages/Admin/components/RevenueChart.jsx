import { colors } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
// Make sure to import the Chart component

const RevenueChart = ({ x, y }) => {
    const state = {
        options: {
            chart: {
                type: 'area',
                height: 300,
                animations: {
                    enabled: true,
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            grid: {
                show: true,
            },
            xaxis: {
                categories: x,
                labels: {
                    style: {
                        colors: 'white', // Set the color of the X-axis labels
                        fontSize: '15px', // Optional: Set font size for better visibility
                    },
                },
                axisBorder: {
                    color: 'white', // Set the color of the X-axis line
                },
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'white', // Set the color of the Y-axis labels
                        fontSize: '15px',
                    },
                },
                axisBorder: {
                    show: true,
                    color: 'white', // Set the color of the Y-axis line
                },
            },
            tooltip: {
                theme: 'dark', // Optional: Set tooltip theme
            },
        },
        series: [
            {
                name: 'Sales',
                data: y,
            },
        ],
    };

    return (
        <div>
            <Chart options={state.options} series={state.series} type="area" height={300} />
        </div>
    );
};

export default RevenueChart;