import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function generateRandomColor(length = 6) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const color = Math.floor(Math.random() * 16777215).toString(16);
        colors.push(`#${color}`);
    }
    return colors;
}

export function Charts({chartOptions, data}) {
    const {legendTitle, label, identifier, dataKey, extraOptions = {}} = chartOptions;

    const labels = Object.values(data).map((item) => item[identifier]);
    const chartData = Object.values(data).map((item) => item[dataKey]);

    const options = {
        ...extraOptions,
        // indexAxis: 'y',
        // elements: {
        //     bar: {
        //         borderWidth: 2,
        //     },
        // },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: legendTitle ? true : false,
                text: legendTitle,
            },
        },
    };

    const colorForBar = generateRandomColor(labels.length);

    const parsedData = {
        labels,
        datasets: [
            {
                label: label,
                data: chartData,
                borderColor: colorForBar,
                backgroundColor: colorForBar,
            },
        ],
    };

    if (!labels.length) return <div className='no-trends'>No Trends</div>;


    return <Bar options={options} data={parsedData} height="100px"/>;
}
