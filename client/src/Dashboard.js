import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jwt from 'jsonwebtoken'


function Dashboard() {
  const history = useNavigate()
  const [quote, setQuote] = useState('')
  const [tempQuote, setTempQuote] = useState('')

  async function populateQuote() {
		const req = await fetch('http://localhost:1337/api/quote', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
			setQuote(data.quote)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history('/login')
			} else {
				populateQuote()
			}
		}
	}, [])

  async function updateQuote(event){
    event.preventDefault();
    const req = await fetch('http://localhost:1337/api/quote', {
      method: 'POST',
			headers: {
        'Content-Type': 'application/json',
				'x-access-token': localStorage.getItem('token'),
			},
      body: JSON.stringify({
        quote: tempQuote,
      })
		})

		const data = await req.json()
		if (data.status === 'ok') {
      setTempQuote('')
			setQuote(tempQuote)
		} else {
			alert(data.error)
		}
  }


  return (
    <div>
      Your quote: {quote || 'No Quote Found'} 
      <form onSubmit={updateQuote}>
        <input placeholder='Quote' value = {tempQuote} onChange={(e)=> setTempQuote(e.target.value)}/>
        <input type='submit' value='Update Quote'/>
        </form></div>
  )
}

export default Dashboard