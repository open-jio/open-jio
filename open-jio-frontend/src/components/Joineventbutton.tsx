import { notification } from "antd";
import { theme1 } from "../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Joineventbutton = (props: {eventid: number, initiallyJoined : boolean | undefined, darkbackground : boolean | undefined}) => {
  const navigate = useNavigate();
  const [, setIsPending] = useState<boolean>(false); //not used yet

  const style = {
    display: "flex", justifyContent: "center", alignItems:"center", height: "44px",
  };

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
  if (props.darkbackground !== undefined && props.darkbackground ){
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          joinevent();
        }}
        style={style}
      >
        {props.initiallyJoined ? <div>Joined event!</div> : <div>Join event</div>}
        
      </div>
    );
  }
  else {
    return (
      <div
        onClick={(event) => {
          event.stopPropagation();
          joinevent();
        }}
        style={style}
      >
        {props.initiallyJoined ? <div style={{color : theme1.token?.colorPrimary}}>Joined event!</div> : <div>Join event</div>}
        
      </div>
    );
  }
};

export default Joineventbutton;
