import {useNavigate} from "react-router-dom";
import {Input} from "antd";
import type { SearchProps } from 'antd/es/input/Search';

const {Search} = Input;

const SearchBar = ({setPageNumber} : {setPageNumber : React.Dispatch<React.SetStateAction<number>>}) => {
    const navigate = useNavigate();
    // const [searchTerm, setSearchTerm] = useState<string>('');
    // const [, setIsPending] = useState<boolean>(false); //not used yet
    // const [err, setErr] = useState<any>(null); //error message from server
    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        console.log(info?.source, value);
        navigate("/events/?search=" + encodeURI(value))
        setPageNumber(1);
    }

    return (
        <Search className = "searchbar"
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
        />
    )

}
export default SearchBar;