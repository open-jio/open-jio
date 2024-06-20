import { notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Joineventbutton = (props: {eventid: number}) => {
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet
  const joinevent = async () => {
    console.log("Joining event");
    setIsPending(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_KEY + "/events/register/" + props.eventid, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const respjson = await response.json();
        throw respjson.error;
      } else {
        setIsPending(false);
        navigate("/events/details/" + props.eventid)
        notification.success({
          message: "Joined Event",
          description:
            "You have joined the event successfully.",
          placement: "bottomLeft",
          duration: 0,

        });
      }
    } catch (error: any) {
      setIsPending(false);
      notification.error({
        message: "Failed to join event",
        placement: "bottomLeft",
        duration: 0,

      });
    }
  }
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        joinevent();
      }}
      style={{display: "flex", justifyContent: "center", alignItems:"center", height: "44px",}}
    >
      Join event
      
    </div>
  );
};

export default Joineventbutton;
