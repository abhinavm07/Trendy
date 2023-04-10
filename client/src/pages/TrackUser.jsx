import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'
import file from '../assets/file.png'
import SearchBar from "../components/SearchBar.jsx";
import {IoSearch} from "react-icons/all.js";
const Page1 = () => {
  const [formData, setFormData] = useState({
    data: '',
  })

  const { data } = formData

  const onSubmit = (e) => {
    e.preventDefault()
    toast.success(data)
  }

  const onChange = (e) => {
    setFormData((prevstate) => ({
      ...prevstate,
      [e.target.name]: e.target.value,
    }))
  }
  return (
    <>
      <div className=' sidecontainer'>
            <SearchBar
                onSubmit={onSubmit}
                value={data}
                onChange={onChange}
                name='data'
                id='data'
                placeholder='Search here'
                disabled={!data}
                type='text'
                icon='@'
                buttonIcon={<IoSearch/>}
            />
      </div>

      <div className='mt-10 gap-6 flex'>
        <div className='flex-col display'>
          <h1 className='font-bold my-10 text-4xl'>Trending Topics</h1>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Elon
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Twitter
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Ipl
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Elon
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Twitter
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Ipl
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Elon
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Twitter
          </span>
          <span className='bg-slate-300 rounded-sm text-black p-5 m-2'>
            Ipl
          </span>
        </div>
        <div className='flex'>
          <img src={file} alt='file' />
        </div>
      </div>
    </>
  )
}

export default Page1
