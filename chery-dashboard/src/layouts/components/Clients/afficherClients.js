import { Layout, Breadcrumb, Typography } from 'antd';
import React from 'react';
import Display from './display';
import AddClient from './addClient'

const { Content } = Layout;

const { Title } = Typography;

class afficherClients extends React.Component {

  render() {
    return (<>
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Clients</Breadcrumb.Item>
        </Breadcrumb>

        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
          <Title level={3} style={{ textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
            Liste des clients
          </Title>
          <Display />
        </div>
      </Content>

    </>
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherClients;