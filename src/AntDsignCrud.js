import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Form, Input, Button, Select, Table, Drawer } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";

export default () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [tutorialId, setTutorialId] = useState();
  const [selectedTutorialId, setSelectedTutorialId] = useState(-1);
  const [tutorialObject, setTutorialObject] = useState({
    title: "",
    description: "",
    published: "",
    mobileNo: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  //===================get data================================================
  const fetchData = () => {
    axios
      .get("http://localhost:3001/api/tutorials/getData ")
      .then((response) => {
        console.log(response.data);
        setDataSource(response.data.reverse()); //reverse() to get updated data first
        setTotalPages(response);
      });
  };

  //============post/add=====================================================
  const onSubmit = (event) => {
    console.log(tutorialObject);
    //event.preventDefault();
    if (
      tutorialObject.title &&
      tutorialObject.description &&
      (tutorialObject.published || !tutorialObject.published) &&
      tutorialObject.mobileNo.length === 10
    ) {
      axios
        .post("http://localhost:3001/api/tutorials/add", {
          ...tutorialObject,
        })
        .then((response) => {
          console.log(response);
          alert("added");
          fetchData();
          form.resetFields();
        });
    } else {
      alert("Mobile Number should be 10 digit");
    }
  };

  //=================update==========================================
  const onUpdateEditRow = () => {
    if (tutorialId > 0 && tutorialObject.mobileNo.length === 10) {
      axios
        .put("http://localhost:3001/api/tutorials/update/" + tutorialId, {
          id: tutorialId,
          ...tutorialObject,
        })
        .then((response) => {
          if (response) {
            fetchData();
            alert("updated");
            onResetEditRow();
          }
        });
    } else {
      alert("mobile number should be 10 digit");
    }
  };
  //reset edit row handler
  const onResetEditRow = () => {
    setSelectedTutorialId(-1);
    setTutorialObject({
      title: "",
      description: "",
      published: "",
      mobileNo: "",
      //  ...tutorialObject,
    });
  };

  //====================Delete=========================================
  const onDeleteHandler = (tutorialId) => (event) => {
    event.preventDefault();
    console.log(tutorialId);
    axios
      .delete("http://localhost:3001/api/tutorials/deleteData/" + tutorialId, {
        id: tutorialId,
      })
      .then((response) => {
        if (response) {
          fetchData();
          alert("Deleted");
        }
      });
  };

  //form reset handler
  const onReset = () => {
    form.resetFields();
  };

  //colums input fields
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      //   render: (text) => console.log(text),
    },
    {
      title: "Description  ",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Published  ",
      dataIndex: "published",
      render: (text) => (text === true ? "yes" : "no"),
      key: "published",
    },
    {
      title: "MobileNo  ",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Options  ",
      dataIndex: "",
      render: (text) => (
        <>
          <Button type="primary" danger onClick={onDeleteHandler(text.id)}>
            Delete
          </Button>
          <Button onClick={onEdit(text)}>Edit</Button>
        </>
      ),
      //   render: (text) => <Button onClick={onrenderhandler(text)}>delete</Button>,
      key: "key",
    },
  ];
  //   const onrenderhandler = (text) => (e) => {
  //     e.preventDefault();
  //     console.log(text);
  //   };

  const onTutorialPublishedHandler = (event) => {
    console.log(event);
    if (event) {
      //console.log(event);
      setTutorialObject({
        ...tutorialObject,
        ["published"]: event === "yes" ? true : false,
      });
    }
  };

  const onTutorialObjectChangehandler = (event) => {
    if (event) {
      const { name, value } = event.target;
      setTutorialObject({
        ...tutorialObject,
        [name]: value,
      });
    }
  };

  //drower close
  const onClose = () => {
    setVisible(false);
    setTutorialObject({
      title: "",
      description: "",
      published: "",
      mobileNo: "",
    });
  };
  const onEdit = (tutorialObject) => (e) => {
    e.preventDefault();
    console.log(tutorialObject);
    setVisible(true);
    setTutorialId(tutorialObject.id);
    setTutorialObject({
      title: tutorialObject.title,
      description: tutorialObject.description,
      published: tutorialObject.published,
      mobileNo: tutorialObject.mobileNo,
    });
    setSelectedTutorialId(tutorialObject.id);
  };

  //======page layout=====
  const { Option } = Select;
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
  };
  return (
    <>
      <h1>Tutorial Details</h1>
      <Form {...layout} form={form} name="control-hooks" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Tutorial Title"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Enter tutorial title"
            name="title"
            value={tutorialObject.title}
            onChange={onTutorialObjectChangehandler}
          />
        </Form.Item>

        <Form.Item
          name="Description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Enter tutorial descrption"
            name="description"
            value={tutorialObject.description}
            onChange={onTutorialObjectChangehandler}
          />
        </Form.Item>

        <Form.Item
          name="published"
          label="Published"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option "
            name="published"
            onChange={onTutorialPublishedHandler}
            allowClear
          >
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Mobile"
          label="Mobile No."
          rules={[{ required: true }]}
        >
          <Input
            type="number"
            placeholder="Enter your mobile no"
            name="mobileNo"
            value={tutorialObject.mobileNo}
            onChange={onTutorialObjectChangehandler}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>

          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <h1>====================All Data====================</h1>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          total: totalPages,
        }}
      ></Table>
      <Drawer
        title="Edit Your Content"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form>
          <Form.Item
            name="title"
            label="Tutorial Title"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Enter tutorial title"
              type="text"
              name="title"
              defaultValue={tutorialObject.title}
              id="title"
              onChange={onTutorialObjectChangehandler}
            />
          </Form.Item>

          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Enter tutorial descrption"
              name="description"
              defaultValue={tutorialObject.description}
              onChange={onTutorialObjectChangehandler}
            />
          </Form.Item>

          <Form.Item
            name="published"
            label="Published"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a option "
              name="published"
              defaultValue={tutorialObject.published == true ? "yes" : "no"}
              onChange={onTutorialPublishedHandler}
              allowClear
            >
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="Mobile"
            label="Mobile No."
            rules={[{ required: true }]}
          >
            <Input
              type="number"
              placeholder="Enter your mobile no"
              name="mobileNo"
              defaultValue={tutorialObject.mobileNo}
              onChange={onTutorialObjectChangehandler}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gender !== currentValues.gender
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("gender") === "other" ? (
                <Form.Item
                  name="customizeGender"
                  label="Customize Gender"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={onUpdateEditRow}>
              Update
            </Button>
            {/* <Button htmlType="button" onClick={onReset}>
              Reset
            </Button> */}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

// const tabledata = [
//   {
//     title: "java",
//     description: "high level language",
//     published: "yes",
//     mobileNo: "87928792",
//   },
//   {
//     title: "react",
//     description: "scripting",
//     published: "yes",
//     mobileNo: "87928792",
//   },
//   {
//     title: "node",
//     description: "scripting",
//     published: "no",
//     mobileNo: "87928792",
//   },
// ];
