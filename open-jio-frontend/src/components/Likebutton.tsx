import { HeartOutlined, HeartTwoTone } from "@ant-design/icons";
import { theme1 } from "../App";
import { useState } from "react";

const Likebutton = (props: { numberOfLikes: number, id : number, initiallyLiked : boolean | undefined}) => {

  const [liked, setLiked] = useState<boolean>(props.initiallyLiked == undefined ? false : props.initiallyLiked);
  return (
    <div onClick={(event) => {
      event.stopPropagation();
      console.log("test");
      setLiked(!liked);
      
    }}
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
      <div style={{color: liked ? theme1.token?.colorPrimary : undefined}}>{props.numberOfLikes}</div>
    </div>
  );
};

export default Likebutton;
