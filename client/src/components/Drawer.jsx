import { FaHamburger } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
const Drawer = () => {
  return (
    <div className='drawer drawer-mobile'>
      <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col items-center justify-center'>
        <label
          htmlFor='my-drawer-2'
          className='btn btn-primary drawer-button lg:hidden'
        >
          <FaHamburger />
        </label>
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
        <ul className='menu p-4 w-80 bg-base-100 text-base-content'>
          {/* TODO: "Add Font awesomes"  */}
          <li>
            <a href='/analytics'>User Analytics</a>
          </li>
          <li>
            <a href='/trackuser'>Track User</a>
          </li>
          <li>
            <a href='/comparision'>Comparision</a>
          </li>
          <li>
            <a href='/sentiment'>Sentiment Analysis</a>
          </li>
          <li>
            <a href='/support'>Support</a>
          </li>
          <li>
            <a href='/setting'>
              <IoSettingsOutline /> Setting
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Drawer
