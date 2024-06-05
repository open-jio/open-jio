import {useState} from "react"
import {useNavigate} from "react-router-dom";
import {Input} from "antd";
import { Event } from "../types/event";
import { useEventsSearchNoPageNumber } from "./useEventsSearch";
import type { SearchProps } from 'antd/es/input/Search';
import debounce from 'lodash/debounce';


const {Search} = Input;

type SearchBarProps = {
    setPageNumber : React.Dispatch<React.SetStateAction<number>>,
    setFirstTime : React.Dispatch<boolean>
}

const SearchBar = ({setPageNumber, setFirstTime} : SearchBarProps) => {
    const navigate = useNavigate();
    const dropdownLimit = 6;
    const [events, setEvents] = useState<Array<any> | any>([]);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);


    const [searchTerm, setSearchTerm] = useState<string>('');
    // const [, setIsPending] = useState<boolean>(false); //not used yet
    // const [err, setErr] = useState<any>(null); //error message from server
    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value);
        setSearchTerm(value);
        setFirstTime(true);
        navigate("/events/?search=" + encodeURI(value))
        setPageNumber(1);
    }

    const onChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSendRequest(e.target.value);
        console.log(e.target.value);
        
    }
    const sendRequest = (value : string) => {
        // send value to the backend
        if (value == '') {
            useEventsSearchNoPageNumber(
                import.meta.env.VITE_API_KEY + "/events/search?limit=" + dropdownLimit, 
                setEvents, setIsPending, setError)
        } else {
            useEventsSearchNoPageNumber(
            import.meta.env.VITE_API_KEY + 
            "/events/search?search=" + value +  "&limit=" + dropdownLimit,
             setEvents, setIsPending, setError)
        }
    };

    //debouncing
    const debouncedSendRequest = debounce(sendRequest, 500);
      

    const onClick = (eventName : string) => {
        setSearchTerm(eventName);
    }

    return (
        <div className = "search-container">
            <div className = "search-inner">
            <Search className = "searchbar"
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                onChange = {onChange}
                value = {searchTerm}

            />
            </div>



            {/*dropdown!!*/}
            <div className = "dropdown">
            {events == null || events.length === 0 ? (
                <div className = "dropdown-empty">No events</div>
                ) : (
                events.map((event: Event, index: number) => {
                    // replace special characters
                      
                    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const titleParts = event.Title.split(new RegExp(`(${escapedSearchTerm})`, 'gi'));
                    console.log(titleParts);
                    return (
                        <div key = {index} onClick = {() => onClick(event.Title)} className="dropdown-row">
                        {titleParts.map((part, i) => (
                        <span key={i}>
                             {part === searchTerm ?<b>{part}</b> : part}
                        </span>
                        ))}
                        </div>
                    )} ))
                }
            </div>

        </div>
        
    )

}
export default SearchBar;