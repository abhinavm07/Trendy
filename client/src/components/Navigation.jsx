import {Link, useLocation} from "react-router-dom";


export default function Navigation(items) {
    const location = useLocation();

    function getActiveClass(path) {
        const windowPath = location.pathname;
        if (path == windowPath) {
            return 'activePath';
        }
        //if page is not found return an empty string
        return '';
    }

    return (
        <ul className='menu w-80 bg-base-100 text-base-content'>
            {Object.values(items)[0].map((item) => (
                !item?.hidden && <li key={item.name} className={getActiveClass(item.path)}>
                    <Link to={item.path} className={item.disabled ? 'disabledLink' : ''}>
                        {item.icon}
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}