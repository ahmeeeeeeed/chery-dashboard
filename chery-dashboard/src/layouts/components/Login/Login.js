import React from 'react'
import { Card, Row, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LoginForm from './LoginForm'


const { Title } = Typography;



const Login = () => {
    return (
        <div className="site-card-border-less-wrapper">
            <Row >

                <Card className="login-card" bordered={false} style={{ width: '30%' }}>
                    <Avatar size={100} icon={<UserOutlined />} />
                    <Title level={3} style={{ marginBottom: 40 }}>Login</Title>
                    <LoginForm />
                </Card>

            </Row>

        </div>
    )
}
export default Login