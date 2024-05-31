import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Emailverifiedpage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState<boolean>(false); //not used yet
  const [, setErr] = useState<any>(null); //error message from server
  const sendemail = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_KEY + "/verifyemail?token=" + token,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
        navigate("/events");
      }
    } catch (error: any) {
      setIsPending(false);
      setErr(error);
    }
  };
  useEffect(() => {
    sendemail();
  }, []);
  return (
    <div>
        {isPending && <div>Loading...</div>}
        {!isPending && <div>Email is verified</div>}
      
      {token}
    </div>
  );
};

export default Emailverifiedpage;
