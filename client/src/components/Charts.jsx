import React, {useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, ArcElement,
} from 'chart.js';
import {Bar, Pie} from 'react-chartjs-2';
import {BiDownload, ImShare, IoSave} from "react-icons/all.js";
import {getSharedContents, saveTrendChart, shareContent} from "../features/favourites/favouriteSlice.js";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import ShareModal from "./ShareModal.jsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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
    const dispatch = useDispatch();
    const {legendTitle, label, identifier = null, dataKey = null, chartTitle, isMultiple = false, ignoreField, chartLabels} = chartOptions;

    const isFromFavourites = extraOptions.isFromFavourites || false;
    const isPie = extraOptions.chartType === 'pie' || false;
    let firstKey= 0;
    if(isMultiple) {
        firstKey = Object.keys(data)[0];
    }

    const labels = identifier ? Object.values(data).map((item) => item[identifier]) :
        (isFromFavourites ? Object.keys(data[0]) : isMultiple ? chartLabels : Object.keys(data));

    const chartData = dataKey ? Object.values(data).map((item) => item[dataKey]) :
        (isFromFavourites ? Object.values(data[0]) :
            Object.values(data));
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

    function generateDataSet(){
        if (isMultiple) {
            const dataSet = [];
            Object.keys(data).forEach((key) => {
                dataSet.push({
                    label: key,
                    //filter keys in ignorefield from data[key]
                    data: Object.keys(data[key]).filter((item) => !ignoreField.includes(item)).map((item) => data[key][item]),
                    borderColor:  generateRandomColor(chartLabels.length),
                    backgroundColor: generateRandomColor(chartLabels.length),
                })
            })
            return dataSet;
        }
        return [{
            label: label,
            data: chartData,
            borderColor: colorForBar,
            backgroundColor: colorForBar,
        }];
    }

    let parsedData = {
        labels,
        datasets: generateDataSet()
    };

    if (!labels.length) return <div className='no-trends'>No Trends</div>;

    function exportChart() {
        const canvas = document.querySelector('canvas');
        const link = document.createElement('a');
        const date = new Date();
        link.download = `${label}_${date.getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    const [shareModalVisibility, setShareModalVisibility] = useState(false);

    async function shareFunctionCallback(email) {
        const shareInfo = {sharedTo: email, contentType: 'chart', savedId: extraOptions.id};
        const res = await dispatch(shareContent(shareInfo));
        const {msg, type} = res.payload;
        if (msg) {
            toast[type](msg);
        }
        if (type === 'success') {
            setShareModalVisibility(false);
            dispatch(getSharedContents());
        }
    }

    function shareChart() {
        setShareModalVisibility(true);
    }

    async function saveChart() {
        toast.info('Saving Chart...');
        const saveData = {
            chartOptions,
            data,
            deletedAt: null,
            chartID: null,
        };
        const checkSave = await dispatch(saveTrendChart(saveData));
        if (checkSave?.payload?.saved) {
            toast.success('Chart Saved Successfully');
        }
    }


    return <div className='flex flex-col'>
        {(canExport || canSave) &&
            (<div className='chart-actions flex flex-row ml-auto'>
                {canSave &&
                    (<div className='chart-action' title='Save Chart' onClick={() => saveChart()}>
                        <IoSave className='saveChart cursor-pointer'/>
                    </div>)
                }{canExport &&
                (<div className='chart-action' title='Download PNG' onClick={() => exportChart()}>
                    <BiDownload className='downloadChart cursor-pointer'/>
                </div>)
            }
                {canShare &&
                    (<div className='chart-action' title='Share Chart' onClick={() => shareChart()}>
                        <ImShare className='downloadChart cursor-pointer'/>
                    </div>)
                }
            </div>)}
        {shareModalVisibility && <ShareModal action={shareFunctionCallback} type='chart' closeModal={()=>setShareModalVisibility(false)}/>}
        {isPie ? <Pie data={parsedData}></Pie> : <Bar options={options} data={parsedData} height={height} width={width}/>}
    </div>;
}
