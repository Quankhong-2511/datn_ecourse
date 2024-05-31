import { useNavigate } from 'react-router-dom';
import MPath from 'routes/routes';
import authStore from 'zustandStore/auth';

const useService = () => {
  const { currentUser, saveCurrentUser } = authStore();
  const navigate = useNavigate();

  const onLogout = () => {
    saveCurrentUser({});
    localStorage.clear();
    navigate(MPath.USER_HOME);
  };

  return {
    onLogout,
    currentUser,
  };
};

export default useService;
