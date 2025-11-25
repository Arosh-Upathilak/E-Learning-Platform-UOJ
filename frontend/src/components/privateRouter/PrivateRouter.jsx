import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

function PrivateRouter({ element, adminOnly = false }) {
  const { userData, fetchData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await fetchData();
      setLoading(false);
    };
    init();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      if (!userData) {
        navigate("/");
      } else if (adminOnly && !userData.IsAdmin) {
        navigate("/home");
      }
    }
  }, [userData, adminOnly, navigate, loading]);

  if (loading) {
    return <div>Loading ....</div>;
  }

  if (userData && (!adminOnly || userData.IsAdmin)) {
    return element;
  }

  return null;
}

export default PrivateRouter;
