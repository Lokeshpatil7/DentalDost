import React from "react";
import { useState } from "react";import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Form, Input, Button, Select, Table, Drawer, Alert, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import { useState, useEffect } from "react";
import axios from "axios";

export default () => {
  const [form] = Form.useForm();
  const [drawerForm] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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
        // console.log(response.data);
        setDataSource(response.data.reverse()); //reverse() to get updated data first
        setTotalPages(response);
      });
  };

  //============post/add=====================================================
  const onSubmit = (event) => {
    //  console.log(tutorialObject);
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
          // console.log(response);
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
    // console.log("tutorialObject", tutorialObject);
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
            onCloseDrawer();
            // form.resetFields();
          }
        });
    } else {
      alert("mobile number should be 10 digit");
    }
  };
  //reset edit row handler
  const onResetEditRow = () => {
    form.resetFields();
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
    Modal.confirm({
      title: "are you want to delete this content",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        axios
          .delete(
            "http://localhost:3001/api/tutorials/deleteData/" + tutorialId,
            {
              id: tutorialId,
            }
          )
          .then((response) => {
            if (response) {
              fetchData();
              alert("Deleted");
            }
          });
      },
    });
    event.preventDefault();
    //console.log(tutorialId);
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
            Delete <DeleteOutlined onClick={onDeleteHandler(text.id)} />
          </Button>

          <Button onClick={onEdit(text)}>
            Edit <EditOutlined onClick={onEdit(text)} />
          </Button>
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
    // console.log(event);
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
  const onCloseDrawer = () => {
    setVisible(false);
    drawerForm.resetFields();
  };

  const onEdit = (tutorialObject) => (event) => {
    event.preventDefault();
    // console.log(tutorialObject);
    setVisible(true);
    setTutorialId(tutorialObject.id);
    drawerForm.resetFields();
    setTutorialObject({
      title: tutorialObject.title,
      description: tutorialObject.description,
      published: tutorialObject.published,
      mobileNo: tutorialObject.mobileNo,
    });
    setSelectedTutorialId(tutorialObject.id);
  };

  //onEditObjectChangeHandler
  const onEditObjectChangeHandler = (event) => {
    if (event) {
      const { name, value } = event.target;
      setTutorialObject({
        ...tutorialObject,
        [name]: value,
      });
    }
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
        onClose={onCloseDrawer}
        visible={visible}
      >
        <Form form={drawerForm}>
          <Form.Item
            name="title"
            label="Tutorial Title"
            rules={[{ required: true }]}
          >
            <Input
              placeholder="Enter the Tutorial Title"
              type="text"
              class="form-control"
              id="title"
              name="title"
              defaultValue={tutorialObject?.title}
              onChange={onEditObjectChangeHandler}
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
              defaultValue={tutorialObject?.description}
              onChange={onEditObjectChangeHandler}
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
              defaultValue={tutorialObject?.published == true ? "yes" : "no"}
              onChange={onEditObjectChangeHandler}
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
              defaultValue={tutorialObject?.mobileNo}
              onChange={onEditObjectChangeHandler}
            />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={onUpdateEditRow}>
              Update
            </Button>
            {/* <Button htmlType="button" onClick={onResetEditRow}>
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

import "antd/dist/antd.css";
import "./index.css";
import { Form, Input, Button, Select, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import FormItem from "antd/lib/form/FormItem";
export default () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editngTutorial, setEditingTutorial] = useState(null);
  const { Option } = Select;
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
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditTutorial(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteTutorial(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];
  const onAddTutorial = () => {
    const randomNumber = parseInt(Math.random() * 15);
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
  const onDeleteTutorial = (record) => {
    Modal.confirm({
      title: "are you want to delete this content",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((previous) => {
          return previous.filter((tutorial) => tutorial.id !== record.id);
        });
      },
    });
  };

  const onEditTutorial = (record) => {
    setIsEdit(true);
    setEditingTutorial({ ...record });
  };
  const resetEditing = () => {
    setIsEdit(false);
    setEditingTutorial(null);
  };
  return (
    <>
      <Form>
        <Form.Item
          name="title"
          label="Tutorial Title"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="Enter tutorial title"
            name="title"
            // value={tutorialObject.title}
            //onChange={onTutorialObjectChangehandler}
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
            // value={tutorialObject.description}
            // onChange={onTutorialObjectChangehandler}
          />
        </Form.Item>
        <Form.Item
          name="published"
          label="Published"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option "
            //name="published"
            // onChange={onTutorialPublishedHandler}
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
            // value={tutorialObject.mobileNo}
            // onChange={onTutorialObjectChangehandler}
          />
        </Form.Item>
      </Form>
      ========================all data========================
      <div>
        <Button onClick={onAddTutorial}>Add new Tutorial</Button>
        <Table columns={columns} dataSource={dataSource}></Table>
        <Form>
          <Modal
            title="Edit tutorial"
            visible={isEdit}
            okText="Save"
            onCancel={() => {
              resetEditing();
              setIsEdit(false);
            }}
            onOk={() => {
              setDataSource((previous) => {
                return previous.map((tutorial) => {
                  if (tutorial.id === editngTutorial.id) {
                    return editngTutorial;
                  } else {
                    return tutorial;
                  }
                });
              });
              resetEditing();
            }}
          >
            <Form.Item label="Title">
              <Input
                value={editngTutorial?.title}
                onChange={(event) => {
                  setEditingTutorial((previous) => {
                    return { ...previous, title: event.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                value={editngTutorial?.description}
                onChange={(event) => {
                  setEditingTutorial((previous) => {
                    return { ...previous, description: event.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Publish">
              <Input
                value={editngTutorial?.published}
                onChange={(event) => {
                  setEditingTutorial((previous) => {
                    return { ...previous, published: event.target.value };
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Mobile Number">
              <Input
                value={editngTutorial?.mobileNo}
                onChange={(event) => {
                  setEditingTutorial((previous) => {
                    return { ...previous, mobileNo: event.target.value };
                  });
                }}
              />
            </Form.Item>
          </Modal>
        </Form>
      </div>
    </>
  );
};
