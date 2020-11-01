import { Layout, Menu, Breadcrumb,Typography,Tooltip,Button  } from 'antd';
import React from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined 
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout>
        <Header  className="site-layout-background" style={{ padding: 20 }} >
          
          <Tooltip title="Se déconnecter" >
            <Button style={{float : 'right'}} type="primary" shape="circle" icon={<LogoutOutlined />} />
          </Tooltip>

          <Title level={3} style={{color : 'white'  }}>Title</Title>

        </Header>

        <Layout style={{ minHeight: '100vh' }}>

          <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
           {/*  <div className="logo" /> */}
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" /* style={{overflow : 'auto',position : 'fixed',width : '100%' }} */>
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Accueil
            </Menu.Item>
             
              <SubMenu key="sub1" icon={<UserOutlined />} title="Gestion des états">
                <Menu.Item key="2">Tom</Menu.Item>
                <Menu.Item key="3">Bill</Menu.Item>
                <Menu.Item key="4">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Gestion des dossiers">
                <Menu.Item key="5">Team 1</Menu.Item>
                <Menu.Item key="6">Team 2</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<TeamOutlined />} title="Gestion des clients">
                <Menu.Item key="7">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" icon={<TeamOutlined />} title="Gestion des conseillers client">
                <Menu.Item key="9">Team 1</Menu.Item>
                <Menu.Item key="10">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="11" icon={<PieChartOutlined />}>
                Historique
            </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">

            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                Bill is a cat.
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default SiderDemo;