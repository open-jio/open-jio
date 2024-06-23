import { Menu, Typography } from "antd";
import Appbar from "../components/Appbar";
import type { MenuProps } from 'antd';
import {useState, useEffect} from 'react';
import {FundOutlined, HeartOutlined, ScheduleOutlined, UserAddOutlined } from "@ant-design/icons";
import Dashboardevents from "../components/Dashboardevents";
import { DashboardCreatedEvents } from "../components/Dashboardevents";


type MenuItem = Required<MenuProps>['items'][number];

  const items: MenuItem[] = [
    {
      label: 'Recommended Events',
      key: 'rec',
      icon: <FundOutlined />,
    },
    {
      label: 'Liked Events',
      key: 'liked',
      icon: <HeartOutlined />,
    },
    {
      label: 'Joined Events',
      key: 'joined',
      icon: <ScheduleOutlined />,
    },
    {
      label: 'Created Events',
      key: 'created',
      icon: <UserAddOutlined />,
    }
]

const Recommended = () => {
  return <div style = {{margin : 10, height : 440}}>
    Work in progress! Please check out the other tabs instead :D
  </div>
}


const Dashboard = () => {

  const [activeSection, setActiveSection] = useState(() => {
    // Initialize active section from localStorage or default to 'section1'
    return localStorage.getItem('activeSection') || 'rec';
  });

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setActiveSection(e.key);
    localStorage.setItem("activeSection", e.key); // Store active section in localStorage
  };

  useEffect(() => {
    // Retrieve active section from localStorage
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection && storedSection !== activeSection) {
      setActiveSection(storedSection);
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  

  
  return (
    <>
      <Appbar />
      <div
        style={{
          margin: 10
        }}
      >
        <Typography>
          <h1>User Dashboard</h1>
        </Typography>
        <Menu onClick={onClick} selectedKeys={[activeSection]} mode="horizontal" items={items} />
        {
          activeSection == "rec" ? <Recommended/> : activeSection == "liked" ? <Dashboardevents action="liked"/> 
          :activeSection == "joined" ? <Dashboardevents action = "joined"/> : activeSection == "created" ? <DashboardCreatedEvents/> : <p>nil</p>
        }
      </div>
    </>
  );
};
export default Dashboard;
