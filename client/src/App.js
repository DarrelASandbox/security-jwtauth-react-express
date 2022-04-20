import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Content, Login, Navigation, Protected, Register } from './components';

export const UserContext = React.createContext([]);

const App = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const logoutCallback = async () => {
    await fetch('http://localhost:4000/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser({});
    navigate('/');
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

      setUser({ accessToken: result.accessToken });
      setLoading(false);
    };

    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navigation logoutCallback={logoutCallback} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/" element={<Content />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
