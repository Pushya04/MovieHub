import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};