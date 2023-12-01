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
      <div>
        <h5 className="wrap-text">{message.content}</h5>
      </div>
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

  const loadDummyMessages = () => {
    for (let index = 0; index < 5; index++) {
      let message: Message = {
        id: index,
        content: index.toString(),
      };
      dummyMessage.push(message);
    }
  };

  const loadDataSource = () => {
    const customStore = new CustomStore({
      key: "id",
      load: () => {
        return Promise.resolve(dummyMessage);
      },
      update(key: number, values: Message[]) {
        dummyMessage[key].content = values[key].content;
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
  };

  const chat = async (responseLineNum: number) => {
    loadDummyMessages();
    let chatString = "";
    for (let index = 0; index < 100; index++) {
      const random = Math.floor(Math.random() * 600) + 200;
      await new Promise((f) => setTimeout(f, random));
      chatString += "**** ";
      dummyMessage[responseLineNum].content = chatString;
      customStore?.update(responseLineNum, dummyMessage);
      changeContent();
    }
  };

  // v.3
  const changeContent = React.useCallback(async () => {
    let position: any = list.current?.instance.scrollTop();
    dataSource?.reload().then(() => {
      requestAnimationFrame(() => {
        list.current?.instance?.scrollTo(position);
      });
    });
  }, [list, customStore, dataSource]);

  // v.2
  // const changeContent = React.useCallback(() => {
  //   let position: any = list.current?.instance.scrollTop();
  //   customStore?.update(9, dummyMessage);

  //   dataSource?.reload().then(() => {
  //     requestAnimationFrame(() => {
  //       list.current?.instance?.scrollTo(position);
  //     })
  //   });
  // }, [list, customStore, dataSource]);

  // v.1
  // function changeContent() {
  //   const currentPosition = list.current?.instance.scrollTop() ?? 0;
  //   customStore?.update(9, dummyMessage);
  //   dataSource?.reload().then(() => {
  //     setTimeout(() => {
  //       list.current?.instance?.scrollTo(currentPosition);
  //     });
  //   });
  // }

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
              text="Response chat message in line 4"
              onClick={() => {
                chat(4);
              }}
            ></Button>
            <div className="rect demo-dark">
              <div className={"dx-card responsive-paddings"}>
                <div className="list-container">
                  <List
                    ref={list}
                    dataSource={dataSource}
                    height="600"
                    scrollingEnabled={true}
                    itemRender={convertToHtmlTemplate}
                    onScroll={UpdateCurrentPosition}
                    repaintChangesOnly={true}
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
