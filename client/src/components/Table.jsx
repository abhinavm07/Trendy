import {dateToString, normalizeString, translateRow} from "../features/helpers.js";
import Chip from "./Chip.jsx";
import html2canvas from "html2canvas";
import React from "react";
import {BiDownload} from "react-icons/all.js";
import {Tooltip} from "react-tooltip";

function shouldHide(data, hideWhen) {
    const hideCondition = normalizeString(hideWhen);
    const condition = data[hideCondition[0]].toString();
    return condition == hideCondition[1];
}

export default function Table({tableConfig}) {
    const {data, header, actions = null, dataKeys, rowClick, tableStyle, rowType, canExport = false} = tableConfig;
    const randomTable = Math.random().toString(36).substring(7);
    const exportAsPng = () => {
        const table = document.getElementById(`${randomTable}_table`);
        html2canvas(table).then((canvas) => {
            const link = document.createElement('a');
            link.download = `${dateToString(new Date())}.png`
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    return (
        <div className='flex flex-col' style={tableStyle}>
            {canExport &&
                (<div className='chart-action ml-auto' title='Download Table as PNG' onClick={() => exportAsPng()}>
                    <BiDownload className='downloadChart cursor-pointer'/>
                </div>)
            }
            <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
                    <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                        {!data && <div className='flex justify-center items-center h-64'>
                            No Data....
                        </div>}
                        {data && <table className='min-w-full divide-y divide-gray-200' id={`${randomTable}_table`}>
                            <thead className='bg-gray-50'>
                            <tr>
                                {header.map((item) => (
                                    <th
                                        scope='col'
                                        key={item}
                                        className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        {item}
                                    </th>
                                ))}
                                {actions && <th scope='col'
                                                className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>}
                            </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                            {data.map((item) => {
                                return (<tr key={item?.id || Math.random()}
                                            className={rowClick ? 'hover:bg-gray-200 cursor-pointer' : ''}>
                                    {dataKeys.map((key) => {
                                        return (
                                            <td className='px-6 py-4  whitespace-normal break-words' key={key}
                                                onClick={() => rowClick ? rowClick(item) : {}}>
                                                {
                                                    (rowType && rowType[key] && rowType[key] === 'Chips' && item[key]) ?
                                                        <Chip content={translateRow(item, key)}/> :
                                                        <div
                                                            className='text-sm  font-medium text-gray-900'>{translateRow(item, key)}</div>
                                                }
                                            </td>
                                        )
                                    })}
                                    {actions &&
                                        <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium cursor-default'>
                                            {actions.map((action) => {
                                                const random = Math.random().toString(36).substring(7);
                                                if (action?.hideWhen && shouldHide(item, action?.hideWhen, action.name)) return <></>;
                                                return <>
                                                    <button
                                                        key={action.name}
                                                        className='text-indigo-600 hover:text-indigo-900 mr-5'
                                                        onClick={() => action.onClick(item)}
                                                        id={`${random}_action`}
                                                    >
                                                        {action.name}
                                                    </button>
                                                    <Tooltip anchorId={`${random}_action`}
                                                             content={action.tooltip || 'Action'}/>
                                                </>
                                            })}
                                        </td>}
                                </tr>)
                            })}
                            </tbody>
                        </table>}
                    </div>
                </div>
            </div>
        </div>
    )


}