import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { Content, Login, Navigation, Protected, Register } from './components';

export const UserContext = React.createContext([]);

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logoutCallback = async () => {
    await fetch('http://localhost:4000/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser({});
  };

  useEffect(() => {
    const checkRefreshToken = async () => {
      const result = await (
        await fetch('http://localhost:4000/api/users/refresh_token', {
          method: 'POST',
          credentials: 'include', // To include cookie
          headers: { 'Content-Type': 'application/json' },
        })
      ).json();

      console.log(result);
      setUser({ accessToken: result.accessToken });
      setLoading(false);
    };

    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <Navigation logoutCallback={logoutCallback} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/" element={<Content />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
