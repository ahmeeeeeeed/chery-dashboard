import React from 'react'
import { Tabs } from 'antd';

import { HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import DisplayEmail from './Email/displayEmail'
import DisplaySMS from './SMS/displaySMS'


const { TabPane } = Tabs;

const DisplayTabs = () => {

    const callback = (key) => {
        //console.log(key);
    }

    return (
        <Tabs centered onChange={callback} type="card">
            <TabPane tab={<span><MailOutlined /> Configuration des Mails</span>} key="1">
                <DisplayEmail />
            </TabPane>
            <TabPane tab={<span> <PhoneOutlined />Configuration des SMS</span>} key="2">
                <DisplaySMS />
            </TabPane>

        </Tabs>
    );
}

export default DisplayTabs