import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'
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
    </>
  )
}

export default Page1
