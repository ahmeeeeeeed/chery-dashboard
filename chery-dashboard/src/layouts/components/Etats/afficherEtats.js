import { Layout, Breadcrumb } from 'antd';
import React from 'react';
import Display from './displayEtats';
import Title from 'antd/lib/typography/Title';
import DisplayTabs from './displayTabs';

const { Content } = Layout;


class afficherEtats extends React.Component {

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Etats</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 500 }}>
          <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
            Liste des états
          </Title>
          <DisplayTabs />
        </div>
      </Content>
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherEtats;