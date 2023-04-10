import {Link} from "react-router-dom";

export default function Navigation(items) {
    console.log(Object.values(items))
    return (
        <ul className='menu p-4 w-80 bg-base-100 text-base-content'>
            {Object.values(items)[0].map((item) => (
                <li key={item.name}>
                    <Link to={item.path} className={item.disabled ? 'disabledLink' : ''}>
                        {item.icon}
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}