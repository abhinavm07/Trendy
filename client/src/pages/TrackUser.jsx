import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'
import file from '../assets/file.png'
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
      <div className=' w-full h-full'>
        <form onSubmit={onSubmit} className='w-full'>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Search here'
              name='data'
              id='data'
              value={data}
              onChange={onChange}
              className='flex mx-2 input input-bordered input-info w-full'
            />
          </div>
          <button type='submit' className='btn btn-outline '>
            Search
          </button>
        </form>
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
