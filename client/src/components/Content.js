import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

const Content = () => {
  const [user] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.accessToken) return navigate('/login');
  }, [navigate, user.accessToken]);

  return <div>Content</div>;
};

export default Content;
