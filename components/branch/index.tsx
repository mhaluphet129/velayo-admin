import React, { useEffect, useState } from "react";
import { Button, Space, Tabs, Tooltip, Typography, message } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

import type { Branch, BranchData } from "@/types";
import NewBranch from "./new_branch";
import BranchService from "@/provider/branch.service";

interface OpenBranch {
  open: boolean;
  data: BranchData | null;
}

const Branch = () => {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [openNewBranch, setOpenNewBranch] = useState<OpenBranch>({
    open: false,
    data: null,
  });
  const [width, setWidth] = useState(0);

  const branch = new BranchService();

  const handleNewBranch = (mode: string, obj: Branch | BranchData) => {
    (async (_) => {
      let res;
      if (mode == "new") res = await _.newBranch(obj);
      else res = await _.updateBranch(obj as BranchData);

      if (res?.success ?? false) {
        message.success(res?.message ?? "Success");
        setTrigger(trigger + 1);
        setOpenNewBranch({ open: false, data: null });
      }
    })(branch);
  };

  const handleOpenEdit = (obj: BranchData) => {
    setOpenNewBranch({ open: true, data: obj });
  };

  useEffect(() => {
    (async (_) => {
      let res2 = await _.getBranch({});
      if (res2?.success ?? false) setBranches(res2?.data ?? []);
    })(branch);
  }, [trigger]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Tabs
        tabPosition="top"
        style={{
          height: "100%",
        }}
        tabBarExtraContent={
          <Button
            type="primary"
            onClick={() => setOpenNewBranch({ open: true, data: null })}
            size="large"
            icon={<PlusOutlined />}
            style={{ margin: "0 10px 10px 10px" }}
          >
            {width < 600 ? "" : "NEW BRANCH"}
          </Button>
        }
        items={branches.map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Branch ${id}`,
            key: id,
            children: (
              <Space direction="vertical" style={{ padding: 20 }}>
                <div>
                  <label
                    htmlFor="address"
                    style={{
                      display: "inline-block",
                      width: 100,
                      fontSize: "1.5em",
                    }}
                  >
                    Name:{" "}
                  </label>
                  <Typography.Text id="address" style={{ fontSize: "1.5em" }}>
                    {_.name}
                  </Typography.Text>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    style={{
                      display: "inline-block",
                      width: 100,
                      fontSize: "1.5em",
                    }}
                  >
                    Address:{" "}
                  </label>
                  <Typography.Text id="address" style={{ fontSize: "1.5em" }}>
                    {_.address}
                  </Typography.Text>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    style={{
                      display: "inline-block",
                      width: 100,
                      fontSize: "1.5em",
                    }}
                  >
                    Device:{" "}
                  </label>
                  <Typography.Text
                    id="device"
                    style={{
                      fontSize: "1.5em",
                    }}
                  >
                    {_.device}
                  </Typography.Text>
                </div>
                <div>
                  <label
                    htmlFor="spm"
                    style={{
                      display: "inline-block",
                      width: 100,
                      fontSize: "1.5em",
                    }}
                  >
                    SPM No. :{" "}
                  </label>
                  <Typography.Text
                    id="spm"
                    style={{
                      fontSize: "1.5em",
                    }}
                  >
                    {_.spm}
                  </Typography.Text>
                </div>
                <Button
                  size="large"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenEdit(_)}
                >
                  EDIT
                </Button>
              </Space>
            ),
          };
        })}
      />

      {/* context */}
      <NewBranch
        open={openNewBranch.open}
        close={() => setOpenNewBranch({ open: false, data: null })}
        onSave={handleNewBranch}
        data={openNewBranch.data}
      />
    </div>
  );
};

export default Branch;
