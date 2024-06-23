import { Menu, Typography } from "antd";
import Appbar from "../components/Appbar";
import type { MenuProps } from 'antd';
import {useState} from 'react';
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

  const [current, setCurrent] = useState('rec');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  

  
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
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        {
          current == "rec" ? <Recommended/> : current == "liked" ? <Dashboardevents action="liked"/> 
          :current == "joined" ? <Dashboardevents action = "joined"/> : current == "created" ? <DashboardCreatedEvents/> : <p>nil</p>
        }
      </div>
    </>
  );
};
export default Dashboard;
