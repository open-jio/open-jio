import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import { theme1 } from "../App";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

export type EventType = "card" | "column";

const Likebutton = (props: { numberOfLikes: number, id : number, initiallyLiked : boolean | undefined, eventType : EventType}) => {

  const [liked, setLiked] = useState<boolean>(props.initiallyLiked == undefined ? false : props.initiallyLiked);
  const [numberOfLikes, setNumberOfLikes] = useState<number>(props.numberOfLikes)
  const [, setIsPending] = useState<boolean>(true);
  const [, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  
  const onClick = (event : any) => {
    event.stopPropagation();

    //optimistic ui
    if (liked == true) { //will go from from true to false
      if (numberOfLikes <= 0) {
        setNumberOfLikes(0);
      } else {
        setNumberOfLikes(prevCount => prevCount - 1);
      }
    } else { //went from false to true
      setNumberOfLikes(prevCount => prevCount + 1);
    }
    setLiked(liked => !liked);
    

    //like / unlike the thing 
   var url = import.meta.env.VITE_API_KEY + "/likes/" + props.id
   const likeinfo  = {likestatus : !liked}
   console.log(!liked)

    const fetchData = async () => {
      try {
        console.log("fetching");
        setIsPending(true);
        setError(null);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(likeinfo),
          credentials: "include",
        });
        //if cookie expired
        if (response.status == 401) {
          localStorage.setItem("isloggedin", "false");
          navigate("/");
          return;
        }
        
        if (!response.ok) {
          throw Error("could not fetch that resource");
        }

      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        }
        setIsPending(false);
        setError(error);

        //reverse it
        if (liked == true) { //should now go from true to false
          if (numberOfLikes <= 0) {
            setNumberOfLikes(0);
          } else {
            setNumberOfLikes(prevCount => prevCount - 1);
          }
        } else { //went from false to true
          setNumberOfLikes(prevCount => prevCount + 1);
        }
        setLiked(liked => !liked);
        
      }
    };
    fetchData();
  }
  return (
    <div>
      {props.eventType == "card" ? (
        <div onClick={onClick}
      
        style={{display: "flex", flexDirection:"column" ,justifyContent: "center", alignItems:"center"}}
        >
          <div>
            {liked ? 
            <HeartTwoTone
            key="Like"
            twoToneColor={theme1.token?.colorPrimary}/>
            : <HeartOutlined key = "Like"/>
            }
            
          </div>
          <div style={{color: liked ? theme1.token?.colorPrimary : undefined}}>{numberOfLikes}</div>
        </div>
      ) : 
      (
        <div onClick={onClick}
        >
            <span style = {{marginRight : "3px"}}>{liked ? 
            <HeartTwoTone
            style={{fontSize: '20px'}}
            key="Like"
            twoToneColor={theme1.token?.colorPrimary}/>
            : <HeartOutlined key = "Like"/>
            } </span>
           
            
          <span style={{fontSize : "20px" , marginTop : "15px", marginRight : "15px", color: liked ? theme1.token?.colorPrimary : undefined}}>{numberOfLikes}</span>
        </div>
      )}
    </div>
    
  );
};

export default Likebutton;
