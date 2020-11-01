import React from 'react'
import { Tabs } from 'antd';

import DisplayAdmins from './displayAdmins'
import DisplayConseillers from './displayConseillers'
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;

const DisplayTabs = () => {

  const callback = (key) => {
    //console.log(key);
  }

  return (
    <Tabs onChange={callback} type="card">
      <TabPane tab={<span> <HomeOutlined />Liste des Administrateurs</span>} key="1">
        <DisplayAdmins />
      </TabPane>
      <TabPane tab={<span> <TeamOutlined />Liste des Conseillers client</span>} key="2">
        <DisplayConseillers />
      </TabPane>

    </Tabs>
  );
}

export default DisplayTabs