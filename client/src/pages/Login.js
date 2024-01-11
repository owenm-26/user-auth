import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function loginUser (event) {
    event.preventDefault();

    const response = await fetch('http://localhost:1337/api/login', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json()

    if(data.user){
      localStorage.setItem('token', data.user);
      alert('Login successful');
      window.location.href = '/dashboard';
    }
    else{
      alert('Please check your username and password');
    }
  }
  return (
    <div>
      <h1>login</h1>
      <form onSubmit={loginUser}>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <br/>
        <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <br/>
        <input type="submit" value="login"/>
      </form>
    </div>
  );
}

export default App;
