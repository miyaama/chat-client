import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Form, Input, Typography, Card, AutoComplete } from "antd";
import axios from "axios";

import { useName } from "../../context";

import "./MailPage.css";

const { Title } = Typography;
const { Meta } = Card;

const MailPage = () => {
  const { name, setName } = useName();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const isLoggedIn = !!name;

  const fetchMessages = () =>
    axios
      .get(`https://itransition-task5-server.herokuapp.com/api/get/${name}`)
      .then((data) => {
        if (!data.data) {
          return;
        }

        const messagesLength = messages.length;
        console.log(messages, messages.length, data.data.length);

        if (messagesLength !== 0 && messagesLength < data.data.length) {
          const newMessage = data.data[0];
          Swal.fire({
            title: "You have a new message",
            html: `<div>${newMessage.subject}</div><div>${newMessage.message}</div`,
            showCancelButton: false,
            showCloseButton: true,
            showConfirmButton: false,
            cancelButtonText: "<span>&#9747;</span>",
            footer: `<div><div>${newMessage.sender_name}</div><div>${newMessage.date}</div></div`,
          });
        }

        setMessages(data.data);
      });

  const fetchUsers = () =>
    axios
      .get(`https://itransition-task5-server.herokuapp.com/api/users`)
      .then((data) => {
        if (data.data) {
          const newUsers = data.data.map((user) => ({
            value: user.name,
          }));
          setUsers(newUsers);
        }
      });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    fetchUsers();
    fetchMessages();

    setInterval(() => {
      fetchMessages();
    }, 10000);

    setInterval(() => {
      fetchUsers();
    }, 60000);

    return () => {
      clearInterval(fetchMessages);
    };
    // eslint-disable-next-line
  }, []);

  const logOut = () => {
    setName("");
    navigate("/");
  };

  const sendMessage = () => {
    axios
      .post("https://itransition-task5-server.herokuapp.com/api/send", {
        recipient_name: recipient,
        sender_name: name,
        message: message,
        subject: subject,
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Message has been sent",
          showCancelButton: false,
          showCloseButton: true,
          showConfirmButton: false,
          cancelButtonText: "<span>&#9747;</span>",
        });
        form.resetFields();
      });
  };

  const layout = {
    labelCol: {
      span: 0,
    },
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="mail-container">
      <div className="left-container">
        <Button onClick={logOut}>Log out</Button>
        <Title level={5}>User name: {name}</Title>
        <Card
          style={{
            width: 350,
          }}
        >
          <div>
            <Title level={4}>Messages</Title>
            {messages.map((message) => (
              <Card
                type="inner"
                size="small"
                title={message.sender_name}
                description={message.date}
                key={message.id}
                onClick={() =>
                  Swal.fire({
                    title: message.subject,
                    text: message.message,
                    showCancelButton: false,
                    showCloseButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "<span>&#9747;</span>",
                    footer: `<div><div>${message.sender_name}</div><div>${message.date}</div></div`,
                  })
                }
                style={{
                  width: 300,
                }}
              >
                <Meta description={message.date} />
                <span>{message.subject}</span>
              </Card>
            ))}
          </div>
        </Card>
      </div>
      <div className="form">
        <Card>
          <Title level={4}>New message</Title>
          <Form
            {...layout}
            form={form}
            layout="vertical"
            name="nest-messages"
            onFinish={sendMessage}
          >
            <Form.Item
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              name={["user", "name"]}
              label="To"
            >
              <AutoComplete
                value={recipient}
                onChange={(value) => {
                  setRecipient(value);
                }}
                filterOption
                options={users}
                style={{ width: "100%" }}
                label="To"
              />
            </Form.Item>

            <Form.Item
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              name={["user", "subject"]}
              label="Subject"
              value={subject}
            >
              <Input />
            </Form.Item>
            <Form.Item
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              name={["user", "message"]}
              label="Message"
            >
              <Input.TextArea rows={10} value={message} />
            </Form.Item>
            <Form.Item wrapperCol={{}}>
              <Button size="large" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default MailPage;
