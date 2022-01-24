import React from "react";
import { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Form, Input, Button, Select, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
export default () => {
  const [dataSource, setDataSource] = useState([
    {
      id: "1",
      title: "java",
      description: "high level language",
      published: "yes",
      mobileNo: "87928792",
    },
    {
      id: "2",
      title: "react",
      description: "scripting",
      published: "no",
      mobileNo: "87928792",
    },
    {
      id: "3",
      title: "node",
      description: "scripting",
      published: "yes",
      mobileNo: "87928792",
    },
  ]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "key",
    },
    {
      title: "Title  ",
      dataIndex: "title",
      key: "key",
    },
    {
      title: "Description  ",
      dataIndex: "description",
      key: "key",
    },
    {
      title: "Published  ",
      dataIndex: "published",
      key: "key",
    },
    {
      title: "MobileNo  ",
      dataIndex: "mobileNo",
      key: "key",
    },
    {
      title: "Options ",
      dataIndex: "",
      key: "key",
      render: (record) => {
        return <></>;
      },
    },
  ];
  const onAddTutorial = () => {
    const randomNumber = parseInt(Math.random() * 10);
    const newTutorial = {
      id: randomNumber,
      title: "name" + randomNumber,
      description: "description" + randomNumber,
      published: "published" + randomNumber,
      mobileNo: "mobileNo" + randomNumber,
    };
    setDataSource((previous) => {
      return [...previous, newTutorial];
    });
  };
  return (
    <>
      <div>
        <Button onClick={onAddTutorial}>Add new Tutorial</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
      </div>
    </>
  );
};
