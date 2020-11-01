import { Layout, Breadcrumb, Divider } from 'antd';
import React from 'react';

import DisplayNumbers from './displayNumbers'
import Title from 'antd/lib/typography/Title';
import NombreDossiersEtat from './NombreDossiersEtat';
const { Content } = Layout;


class Accueil extends React.Component {

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
          <DisplayNumbers />

        </div>
        <Divider />
        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
          <Title level={3} style={{ textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
            Statistiques des dossiers par rapport à chaque état
          </Title>
          <NombreDossiersEtat />
        </div>

      </Content>

    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default Accueil;