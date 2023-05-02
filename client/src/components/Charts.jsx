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
import {BiDownload, ImShare, IoSave} from "react-icons/all.js";

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

export function Charts({chartOptions, data, extraOptions = {}}) {
    const {legendTitle, label, identifier = null, dataKey = null} = chartOptions;

    const labels = identifier ? Object.values(data).map((item) => item[identifier]) : Object.keys(data);
    const chartData = dataKey ? Object.values(data).map((item) => item[dataKey]) : Object.values(data);

    const {height = '100px', width = '100px', canSave = false, canExport = false, canShare = false} = extraOptions;

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

    function saveChart() {
        const canvas = document.querySelector('canvas');
        const link = document.createElement('a');
        const date = new Date();
        link.download = `${label}_${date.getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    function shareChart() {

    }

    return <>
        {(canExport || canSave) &&
            (<div className='chart-actions flex float-right'>
                {canSave &&
                    (<div className='chart-action' title='Save Chart'>
                        <IoSave className='saveChart cursor-pointer'/>
                    </div>)
                }{canExport &&
                (<div className='chart-action' title='Download PNG' onClick={() => saveChart()}>
                    <BiDownload className='downloadChart cursor-pointer'/>
                </div>)
            }
                {canShare &&
                    (<div className='chart-action' title='Share Chart' onClick={() => shareChart()}>
                        <ImShare className='downloadChart cursor-pointer'/>
                    </div>)
                }
            </div>)}
        <Bar options={options} data={parsedData} height={height} width={width}/>
    </>;
}
