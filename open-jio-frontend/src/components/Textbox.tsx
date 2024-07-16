import TextboxTail from "../assets/text_message.png"
import { theme1 } from "../App";


const Textbox = (props : {text : string}) => {
    return (
        
        <div style = {{display : "flex", alignItems : "end", paddingBottom : "5px"}}>
            <img src = {TextboxTail} height = "10px" width = "30px"></img>
            <div style = {{
                backgroundColor: theme1.token?.colorPrimary, 
                maxWidth : "500px",
                minHeight : "30px",
                borderRadius : "5px",
                color : "#f5f5f5",
                paddingTop : "5px",
                paddingLeft : "10px",
                paddingRight : "10px",
                paddingBottom : "5px",
                boxShadow: '2px 2px 2px rgba(0.20, 0.20, 0.20, 0.20)',
                display : "flex",
                wordWrap : "break-word",
                overflowWrap : "break-word"
                }}>
                    {props.text}


                <div style = {{color : "#f5f5f5"}}>
                    whys
                </div>
            </div>
            
        </div>
    )
}


export default Textbox;