import { Layout, Breadcrumb } from 'antd';
import React from 'react';
import DisplayTabs from './displayTabs';

const { Content } = Layout;


class afficherConseillers extends React.Component {

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Conseillers_Admins</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
          <DisplayTabs />
        </div>
      </Content>
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherConseillers;