import { theme1 } from "../App";
import { useState } from "react";
import AnnouncementBox from "./AnnouncementBox";


const Announcements = (props : {eventID : number, isCreator : boolean}) => {
    

    const [openKey, setOpenKey] = useState("All");
    const [firstTime, setFirstTime] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);

    

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
            <MenuItems label = "All" focus = {openKey == "All"} onAnnouncementTypeClick={ () => {
              setFirstTime(true);
              setPageNumber(1);
              setOpenKey("All")
              
            }
            }/>
            <MenuItems label = "Registered" focus = {openKey == "Registered"} 
            onAnnouncementTypeClick={ () => {
              setFirstTime(true);
              setPageNumber(1);
              setOpenKey("Registered")
              
            }
            }/>

            </div>
            {openKey == "All" ? <AnnouncementBox eventID = {props.eventID}
             registered = {false}
             isCreator = {props.isCreator}
             firstTime = {firstTime}
             setFirstTime = {setFirstTime}
             pageNumber={pageNumber}
             setPageNumber={setPageNumber}
             />
              :<AnnouncementBox eventID = {props.eventID} 
              registered = {true}
              isCreator = {props.isCreator}
              firstTime = {firstTime}
              setFirstTime = {setFirstTime}
              pageNumber={pageNumber}
             setPageNumber={setPageNumber}
              />}

        </div>
    )
}

export default Announcements;

