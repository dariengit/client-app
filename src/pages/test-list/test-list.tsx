import React, { useEffect, useRef, useState } from "react";
import "./test-list.scss";
import DataSource from "devextreme/data/data_source";
import Box, { Item } from "devextreme-react/box";
import { Button, List } from "devextreme-react";
import CustomStore from "devextreme/data/custom_store";

interface Message {
  id: number;
  content: string;
}

function convertToHtmlTemplate(message: Message) {
  return (
    <>
      <div>{message.content}</div>
    </>
  );
}

export default function TestList() {
  const [dataSource, setDataSource] = useState<DataSource<any, number>>();
  const [customStore, setCustomStore] =
    useState<CustomStore<Message[], number>>();
  const dummyMessage: Message[] = [];
  const list = useRef<List>(null);

  useEffect(() => {
    loadDummyMessages();
    loadDataSource();
  }, []);

  function loadDummyMessages() {
    for (let index = 0; index < 100; index++) {
      let message: Message = {
        id: index,
        content: index.toString(),
      };
      dummyMessage.push(message);
    }
  }

  function loadDataSource() {
    const customStore = new CustomStore({
      key: "id",
      load: () => {
        return Promise.resolve(dummyMessage);
      },
      update(key: number, values: Message[]) {
        let x = dummyMessage[key];
        x.content = "****";

        return Promise.resolve(dummyMessage);
      },
    });

    setCustomStore(customStore);

    const dataSource = new DataSource({
      store: customStore,
      paginate: false,
      requireTotalCount: false,
    });

    setDataSource(dataSource);
  }

  function changeContent() {
    const currentPosition = list.current?.instance.scrollTop() ?? 0;
    customStore?.update(11, dummyMessage);
    dataSource?.reload();
    list.current?.instance.scrollTo(currentPosition);
  }

  function UpdateCurrentPosition() {
    console.log(list.current?.instance.scrollTop() ?? 0);
  }

  return (
    <>
      <h2 className={"content-block"}>Layout Test</h2>
      <div className={"content-block"}>
        <Box direction="row" width="100%">
          <Item ratio={3}>
            <Button
              text="Change 11 to ****"
              onClick={() => {
                changeContent();
              }}
            ></Button>
            <div className="rect demo-dark">
              <div className={"dx-card responsive-paddings"}>
                <div className="list-container">
                  <List
                    ref={list}
                    dataSource={dataSource}
                    height="400"
                    scrollingEnabled={true}
                    itemRender={convertToHtmlTemplate}
                    onScroll={UpdateCurrentPosition}
                  />
                </div>
              </div>
            </div>
          </Item>
        </Box>
      </div>
    </>
  );
}
