import { useEffect } from 'react';
import { navigate } from 'gatsby';

export default function RedirectToAccountDashboard() {
  useEffect(() => {
    navigate('/account/dashboard', { replace: true });

  }, []);

  return null;
}
