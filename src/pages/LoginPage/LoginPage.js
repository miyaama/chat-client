import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import axios from "axios";

import { useName } from "../../context";
import "./LoginPage.css";

const { Title } = Typography;

const LoginPage = () => {
  const { name, setName } = useName();

  const navigate = useNavigate();

  const login = () => {
    axios
      .post("https://itransition-task5-server.herokuapp.com/api/login", {
        name: name,
      })
      .then(() => {
        navigate("/mail");
      });
  };

  return (
    <div className="login-container">
      <Form
        name="normal_login"
        size="large"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={login}
      >
        <Title level={4}>Welcome to chat!</Title>
        <Form.Item
          name="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
          rules={[
            {
              required: true,
              message: "Please input your Name",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Enter your name"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
