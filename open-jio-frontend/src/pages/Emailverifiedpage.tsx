import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Emailverifiedpage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState<boolean>(false); //not used yet
  const [, setErr] = useState<any>(null); //error message from server
  const verifyemail = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/verifyemail?token=" + token,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
        localStorage.setItem("isloggedin", "true"); //allows user to be authorized during operations
        navigate("/events");
        
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  useEffect(() => {
    verifyemail();
  }, []);
  return (
    <div>
        {isPending && <div>Loading...</div>}
        {!isPending && <div>Email is verified</div>}
    </div>
  );
};

export default Emailverifiedpage;
