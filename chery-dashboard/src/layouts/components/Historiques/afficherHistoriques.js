import { Layout, Breadcrumb } from 'antd';
import React from 'react';
import Display from './display';
import Title from 'antd/lib/typography/Title';

const { Content } = Layout;


class afficherHistoriques extends React.Component {

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Historiques</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
          <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
            Historique d'activité sur la plateforme
          </Title>
          <Display />
        </div>
      </Content>
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherHistoriques;