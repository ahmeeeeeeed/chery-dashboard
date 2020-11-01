import { Layout, Breadcrumb } from 'antd';
import React from 'react';
import DisplayTabs from './displayTabs';
import Title from 'antd/lib/typography/Title';


const { Content } = Layout;


class afficherEmailSms extends React.Component {

    render() {
        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item>Email_SMS</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>
                    <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
                        Configuration des e-mails et SMS
                    </Title>
                    <DisplayTabs />
                </div>
            </Content>
        );
    }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherEmailSms;