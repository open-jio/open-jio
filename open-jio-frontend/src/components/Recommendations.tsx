import React, { useState, useEffect } from "react";
import Eventcard from "./Eventcard";
import { Event } from "../types/event";
import SkeletonImage from "antd/es/skeleton/Image";
import { json } from "react-router-dom";


const getRecommendations = async (eventID : number, eventTitle : string, eventDescription : string, eventVenue : string,
    setEvents : React.Dispatch<any>,
    setIsPending : React.Dispatch<boolean>, setErr : React.Dispatch<Error | null>) => {
        console.log("here")
        let eventids = [];
        let eventlist : Event[] = [];
        const eventData = {
          Tags : eventTitle + " " + eventDescription + " " + eventVenue
        }
        try {
            console.log(import.meta.env.VITE_RECOMMENDER_API_KEY +  
                "/recommender/" + eventID)
            const response = await fetch(import.meta.env.VITE_RECOMMENDER_API_KEY + "/recommender/" + eventID, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(eventData),
            credentials: "include",
            });
            console.log("Response!")
            console.log(response)
            if (!response.ok) {
            const respjson = await response.json();
            throw respjson.error;
            } 
            const respjson = await response.json();
            eventids  = respjson.eventids;
            
        } catch (error: any) {
            setIsPending(false);
            setErr(error);
        }
        console.log(eventlist)
        const eventidinfo = {
            Eventids : eventids
        };
        try {
            const response = await fetch(import.meta.env.VITE_API_KEY + "/events/multiple", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(eventidinfo),
              credentials: "include",
            });
            console.log(response)
            if (!response.ok) {
              const respjson = await response.json();
              throw respjson.error;
            } else {
              setIsPending(false);
              const respjson = await response.json();
              eventlist = respjson.events
              setEvents(eventlist)
            }
          } catch (error: any) {
            setIsPending(false);
            setErr(error);
          }
        setIsPending(false);

        setErr(null);

}

const Recommendations = (props : {eventID : number, eventTitle : string, 
              eventDesc : string, eventVenue : string}) => {
    const [events, setEvents] = useState<Array<any> | any>([]);
    const [isPending, setIsPending] = useState<boolean>(false); //not used yet
    const [, setErr] = useState<any>(null); //error message from server
    
    useEffect(() => {
        getRecommendations(props.eventID, props.eventTitle, props.eventDesc, props.eventVenue, setEvents, setIsPending, setErr);
      }, [props.eventID]);
    return (
        <div style = {{display : "flex", overflowX : "auto",padding : "10px", height : "610px",
                width : "90%", backgroundColor:"white", borderRadius : "10px"}}>
            {events && events.map((event: Event) => {
              return (
                  <div style = {{ width : "450px", paddingRight : "20px"}}>
                
                    <Eventcard
                      id = {event.ID}
                      title={event.Title}
                      description={event.Description}
                      numberOfLikes={event.NumberOfLikes}
                      location={event.Location}
                      date={new Date(event.Time).toLocaleDateString()}
                      time={new Date(event.Time).toLocaleTimeString()}
                      liked = {event.Liked}
                      joined = {event.Joined}
                      imageurls={event.Imageurls}
                      fontsize={12}
                    />
                    </div>
                  )
                })}

            {isPending &&
                Array.from({ length: 5 }, () => (
                    <div>
                    <SkeletonImage
                        active
                        style={{
                        width: 250,
                        height: 250,
                        }}
                    />{" "}
                    

                    </div>
                    
                ))}

        </div>
    )
}

export default Recommendations