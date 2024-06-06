import {useState, useRef} from "react"
import {useNavigate} from "react-router-dom";
import {Input} from "antd";
import { Event } from "../types/event";
import { useEventsSearchNoPageNumber } from "./useEventsSearch";
import type { SearchProps } from 'antd/es/input/Search';
import useDebounce from "../hooks/useDebounce";


const {Search} = Input;

type SearchBarProps = {
    setPageNumber : React.Dispatch<React.SetStateAction<number>>,
    setFirstTime : React.Dispatch<boolean>
}

const SearchBar = ({setPageNumber, setFirstTime} : SearchBarProps) => {
    const navigate = useNavigate();
    const dropdownLimit = 20;
    const [events, setEvents] = useState<Array<any> | any>([]);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    //const [isFocused, setIsFocused] = useState(false);
    const [isFocusedInitially, setIsFocusedInitially] = useState(false);
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [showAutocomplete, setShowAutocomplete] = useState(false);

    const onFocus = () => {
        if (!isFocusedInitially) {
            setIsFocusedInitially(true);
            sendRequest("");
        }
        setShowAutocomplete(true);
    };

    const onBlur = () => {
        //odd
        if (!isDropdownClicked) {
            setShowAutocomplete(false);
          }
          setIsDropdownClicked(false);
    }

    
    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value);
        setSearchTerm(value);
        setFirstTime(true);
        navigate("/events/?search=" + encodeURI(value))
        setPageNumber(1);
    }

    const onChange = (e :  React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedRequest();
        if (error != null) {
            setEvents([]);
        } else if (isPending) {
            //?
        }
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
    const debouncedRequest = useDebounce(() => {
        sendRequest(searchTerm);
    })

    const onAutocompleteClick = (eventName : string) => {
        setSearchTerm(eventName);
        setShowAutocomplete(false); //closes the dropdown box
        //inputRef.current?.focus(); // Refocus the search bar input field
    }

    return (
        <div className = "search-container">
            <div className = "search-inner">
            <Search className = "searchbar"
                placeholder="Input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
                onChange = {onChange}
                value = {searchTerm}
                onFocus = {onFocus}
                onBlur = {onBlur}

            />
            </div>



            {/*dropdown!!*/}
            {showAutocomplete && 
            <div className = "dropdown" 
                    onMouseDown={() => setIsDropdownClicked(true)}>
            {events == null || events.length === 0 ? (
                <div className = "dropdown-empty">No events</div>
                ) : (
                events.map((event: Event, index: number) => {
                    // replace special characters
                      
                    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const titleParts = event.Title.split(new RegExp(`(${escapedSearchTerm})`, 'gi'));
                    return (
                        <div key = {index} onClick = {() => onAutocompleteClick(event.Title)} className="dropdown-row">
                        {titleParts.map((part, i) => (
                        <span key={i}>
                             {part.toLowerCase() === searchTerm.toLowerCase() ?<b>{part}</b> : part}
                        </span>
                        ))}
                        </div>
                    )} ))
                }
            </div> }

        </div>
        
    )

}
export default SearchBar;