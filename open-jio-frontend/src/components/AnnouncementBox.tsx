import React, {useState } from "react";
import Textbox from "./Textbox";
import { Input, Button } from "antd";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import { useRef, useEffect , useCallback} from "react";
import { Announcement } from "../types/announcement";


const AnnouncementBox = (props : {eventID : number, registered : boolean,
    firstTime : boolean,
    setFirstTime : React.Dispatch<React.SetStateAction<boolean>>,
    pageNumber : number,
    setPageNumber : React.Dispatch<React.SetStateAction<number>>,
}) => {



    //infinite scroll logic
    
    const observer = useRef<IntersectionObserver | null>(null);
    const [announcements, setAnnouncements] = useState<Array<any> | any>([]);
    const [newAnnouncement, setNewAnnouncement] = useState(""); //for creating new announcements
    const [authorised, setIsAuthorised] = useState(false);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState(false);

    if (props.registered) {
        fetchAnnouncements(
            import.meta.env.VITE_API_KEY + "/events/posts?registered=true&pageSize=9&page=", 
            props.pageNumber, props.firstTime, props.eventID, setIsAuthorised, setAnnouncements, 
            setIsPending, setHasMore, announcements);
    } else {
        fetchAnnouncements(
            import.meta.env.VITE_API_KEY + "/events/posts?pageSize=9&page=", 
            props.pageNumber, props.firstTime, props.eventID, setIsAuthorised, setAnnouncements, 
            setIsPending, setHasMore, announcements);
    }
    
    const lastEventElementRef = useCallback(
        (node: HTMLDivElement) => {
          if (isPending) return;
    
          if (observer.current) observer.current.disconnect();
          observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
              props.setPageNumber((prevPageNumber) => prevPageNumber + 1);
              props.setFirstTime(false);
            }
          });
          if (node) observer.current.observe(node);
        },
        [isPending, hasMore]
      );


    //submitting new post
    const onChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setNewAnnouncement(e.target.value);
        
    }
    const onSubmit = async () => {
        const formData: any = new FormData();
        console.log("id is " + props.eventID)
        formData.append("Content", newAnnouncement);
        formData.append("Eventid", props.eventID)

        const announcementInfo = {
            Content: newAnnouncement,
            Eventid: props.eventID,
          };
        try {
            const response = await fetch(import.meta.env.VITE_API_KEY + "/events/posts", {
              method: "POST",
              headers: {},
              body: JSON.stringify(announcementInfo),
              credentials: "include",
            });
            if (!response.ok) {
              const respjson = await response.json();
              throw respjson.error;
            } else {
              const respjson = await response.json();
              announcements.unshift(respjson.post)
              setAnnouncements(announcements);
            }
          } catch (error: any) {

          }
        setNewAnnouncement(""); 
    }
    
    


    return (
            
        <div style = {{width : "90%", borderRadius : "5px", backgroundColor : "#ffffff", height : "350px"}}>
            <div style={{height : "5px"}}></div>

                <div style = {{height : "300px"}}                  
                    
                    >
                      
                    <div style = {{
                        display : "flex", 
                        justifyContent : "center", 
                        fontSize : "18px"}}>
                        {isPending && <LoadingOutlined/>}
                    </div>
                    <div style = {{display :"flex", height : "300px", 
                    
                    flexDirection : "column-reverse",
                    overflowY : "auto"
                    }}>
            {
            announcements.map((announcement : Announcement, index : number) => (
              <div  ref = {index + 1 == announcements.length? lastEventElementRef :  null} >
                
                <Textbox id = {props.eventID} text = {announcement.Content} 
                createdAt = {announcement.CreatedAt} 
                updatedAt = {announcement.UpdatedAt} authorised = {props.registered}/>
              </div>
            ))
          }
          
            <div style = {{
                        display : "flex", 
                        justifyContent : "center"}}>
                    {announcements.length == 0 && "No announcements currently!"}
                    </div>  
            </div>
              
                {authorised && <div style = {{width : "90%", margin : "auto", display : "flex"}}>
                    <div style = {{width : "90%", float : "left", paddingRight : "5px"}}>
                        <Input onPressEnter={onSubmit} onChange = {onChange} value = {newAnnouncement}/>
                    </div>
                    
                    <div>
                    <Button type="primary" onClick = {onSubmit} >
                        <SendOutlined/>
                    </Button>
                      </div>
                    
                </div> }
                
            </div>
         </div>
    )
}

export default AnnouncementBox;



const fetchAnnouncements = (url: string, pageNumber: number, 
        firstTime : boolean, eventID : number, 
        setIsAuthorised : React.Dispatch<React.SetStateAction<boolean>>,
        setData : React.Dispatch<React.SetStateAction<Array<any> | any>>,
        setIsPending : React.Dispatch<React.SetStateAction<boolean>>,
        setHasMore : React.Dispatch<React.SetStateAction<boolean>>,
        data : Array<any> | any,
      ) => {
    
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    setData([]);
  }, [url]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        console.log("fetching");
        setIsPending(true);
        setError(null);
        const response = await fetch(url + pageNumber + "&event=" + eventID, {
          credentials: "include",
          signal,
        });

        if (!response.ok) {
          throw Error("could not fetch that resource");
        }
        try {
          const respjson = await response.json();
          const announcementlist :Announcement[] = respjson.posts;
          setIsAuthorised(respjson.authorised);
          setIsPending(false);
          
          if (firstTime) {
            setData(announcementlist);
          } else {
            setData((prevdata: any) => {
              return [...new Set([ ...prevdata, ...announcementlist])];
            });
          }
          
          setHasMore(announcementlist.length > 0)

          setError(null);
        } catch (error: any) {
          setIsPending(false);
          setError(error);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("fetch aborted");
        }
        setIsPending(false);
        setError(error);
      }
    };
    fetchData();

    console.log(data)

    return () => {
      controller.abort();
    };
  }, [url, pageNumber]);

  return error;
}