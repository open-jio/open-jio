import { theme1 } from "../App";
import { useState } from "react";
import Textbox from "./Textbox";
import { Input, Button } from "antd";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import { useRef, useEffect , useCallback} from "react";
import { Announcement } from "../types/announcement";


const Announcements = (props : {eventID : number}) => {

    const [openKey, setOpenKey] = useState("All");
    //infinite scroll logic
    const [pageNumber, setPageNumber] = useState(1);
    const [firstTime, setFirstTime] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const [newAnnouncement, setNewAnnouncement] = useState("");

    const {
        data: announcements,
        setData : setAnnouncements,
        isPending: isLoading,
        hasMore,
    } = fetchAnnouncements(
        import.meta.env.VITE_API_KEY + "/events/posts?pageSize=11&page=", 
        pageNumber, firstTime, props.eventID);

    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop === 0 && !isLoading && hasMore) {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
            setFirstTime(false);
        }
    }, [isLoading, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

        const firstEventElementRef = useCallback(
            (node: HTMLDivElement) => {
                if (isLoading) return;
        
                if (observer.current) observer.current.disconnect();
                observer.current = new IntersectionObserver((entries) => {
                    // Check if top is intersecting
                    if (entries[0].isIntersecting && hasMore) {
                        // Load more items when reaching top
                        setPageNumber((prevPageNumber) => prevPageNumber + 1);
                        setFirstTime(false);
                    }
                });
        
                if (node) observer.current.observe(node);
            },
            [isLoading, pageNumber, hasMore]
        );


    //submitting new post
    const onChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setNewAnnouncement(e.target.value);
        
    }
    const onSubmit = async () => {
        const formData: any = new FormData();
        formData.append("Content", newAnnouncement);
        formData.append("EventID", props.eventID)
        try {
            const response = await fetch(import.meta.env.VITE_API_KEY + "/events/posts", {
              method: "POST",
              headers: {},
              body: formData,
              credentials: "include",
            });
            if (!response.ok) {
              const respjson = await response.json();
              throw respjson.error;
            } else {
              const respjson = await response.json();
              announcements.push(respjson.post)
              setAnnouncements(announcements);
            }
          } catch (error: any) {

          }
        setNewAnnouncement(""); 
    }
    
    

    const MenuItems = (props : {label : string, focus : boolean, onAnnouncementTypeClick : () => void}) => {
        
        const [hover, setHover] = useState(false);
        
        return (
            <div style = {{
                paddingTop: "5px",
                backgroundColor : "#ffffff", 
                width : "45%",
                height : "35px",
                borderRadius: "10px",
                border: "1px solid #eae8ed",
                textAlign : "center",
                color: props.focus ? theme1.token?.colorPrimary : "#253954",
                fontWeight : props.focus ? 500 : 400,
                boxShadow: hover ? '10px 10px 10px rgba(0.05, 0.05, 0.05, 0.05)' : 'none',
                transition: 'box-shadow 0.3s ease-in-out',
            }} onClick = {props.onAnnouncementTypeClick} 
            
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            
            >
            {props.label}
            </div>
        )
    }


    return (
        <div>
            <div style = {{
                display : "flex",
                flexDirection : "row"
            }}> 
            <MenuItems label = "All" focus = {openKey == "All"} onAnnouncementTypeClick={ () => setOpenKey("All")}/>
            <MenuItems label = "Registered" focus = {openKey == "Registered"}  onAnnouncementTypeClick={ () => setOpenKey("Registered")}/>
            </div>
            <div style={{height : "5px"}}></div>
            <div style = {{
            paddingTop: "5px",
            backgroundColor : "#ffffff", 
            width : "90%",
            height : "350px",
            borderRadius: "10px",
            border: "1px solid #eae8ed",
            
            }}>
                <div style = {{height : "300px", overflow : "auto", display : "flex", flexDirection: "column-reverse"}}  
                    ref={firstEventElementRef}
                    
                    >
                    <div style = {{
                        display : "flex", 
                        justifyContent : "center", 
                        fontSize : "18px"}}>
                        {isLoading && <LoadingOutlined/>}
                    </div>
                    
                    {announcements.map((announcement : Announcement) => {
                    return (
                        <Textbox text = {announcement.Content}/>)
                        
                    })}
                   
                </div>
                    
                <div style = {{width : "90%", margin : "auto"}}>
                    <div style = {{width : "90%", float : "left", paddingRight : "5px"}}>
                        <Input onPressEnter={onSubmit} onChange = {onChange} value = {newAnnouncement}/>
                    </div>
                    
                    
                    <Button type="primary" onClick = {onSubmit} >
                        <SendOutlined/>
                    </Button>
                </div>
                
            </div>
        </div>
    )
}

export default Announcements;



const fetchAnnouncements = (url: string, pageNumber: number, firstTime : boolean, eventID : number) => {
    const [data, setData] = useState<Array<any> | any>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
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
          setIsPending(false);
          
          if (firstTime) {
            setData(announcementlist);
          } else {
            setData((prevdata: any) => {
              return [...new Set([...prevdata, ...announcementlist])];
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

    return () => {
      controller.abort();
    };
  }, [url, pageNumber]);

  return { data, setData, isPending, error, hasMore };
}