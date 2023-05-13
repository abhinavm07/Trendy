import React, {useEffect} from "react";
import {IoClose} from "react-icons/all.js";
import {Tooltip} from "react-tooltip";

export default function ActionBox({settings}) {
    const {visible, parentId, position, onOpen, extraOptions, onClose, content} = settings;
    //find the parent element in the DOM
    const parent = document.getElementById(parentId);
    //find the position of the parent element
    const parentPosition = parent?.getBoundingClientRect();
    //find x and y coordinates of the parent element
    const x = parentPosition?.x;
    const y = parentPosition?.y;
    //based on position of element, set the position of the action box next to parent element; supports only LEFT for now need to fix the calculation for others
    const containerStyle = {
        top: position === 'top' ? y : position === 'bottom' ? y + 50 : y,
        left: position === 'left' ? x - 252 : position === 'right' ? x + 50 : x,
        bottom: position === 'bottom' ? y + 50 : position === 'top' ? y - 50 : y,
        right: position === 'right' ? x + 50 : position === 'left' ? x - 50 : x,
    }

    return (
        <div className='action-box-container' style={containerStyle}>
            <div className='action-box flex flex-col'>
                <div className='action-box-header'>
                    <span className='float-right p-2 cursor-pointer' onClick={onClose} id='close'><IoClose/></span>
                </div>
                <div className='action-box-body p-2'>
                    {content}
                </div>
                <div className='ActionBar'>
                    {extraOptions && Object.keys(extraOptions).map((option, index) => {
                        return (
                            <div className='action-box-option' key={index}>
                                <button className='action-box-button float-right' onClick={extraOptions[option].action} id={'action_'+index}>
                                    {extraOptions[option].icon}
                                </button>
                                <Tooltip anchorId={'action_'+index} content={extraOptions[option].label} />
                                <Tooltip anchorId='close' content='Close' />
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );

}