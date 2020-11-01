import React from 'react'
import { Tabs } from 'antd';

import { StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DisplayEtats from './displayEtats';
import DisplayEtatsSupprimes from './displayEtatsSupprimes';



const { TabPane } = Tabs;

const DisplayTabs = () => {

    const callback = (key) => {
        //console.log(key);
    }

    return (
        <Tabs onChange={callback} centered type="card">
            <TabPane tab={<span> <CheckCircleOutlined />Liste des états actifs</span>} key="1">
                <DisplayEtats />
            </TabPane>
            <TabPane tab={<span>  <StopOutlined />Liste des états supprimés</span>} key="2">
                <DisplayEtatsSupprimes />
            </TabPane>

        </Tabs>
    );
}

export default DisplayTabs