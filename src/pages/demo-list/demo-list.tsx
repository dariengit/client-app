import React, { useEffect, useState } from "react";
import "./demo-list.scss";
import List from "devextreme-react/list";
import DataSource from "devextreme/data/data_source";

interface Product {
  id: number;
  name: string;
  description: string;
}

function convertToHtmlTemplate(product: Product) {
  return (
    <>
      <h5>Product Description</h5>
      {product.description.replaceAll("/n", "<br>")}
    </>
  );
}

export default function DemoList() {
  const [myDataSource, setDataSource] = useState<DataSource<any, any>>();

  function loadDataSource() {
    const products: Product[] = [];

    const product1: Product = {
      id: 1,
      name: "computer",
      description: "-This lien 1/n -This is line2/n -This is line3/n",
    };
    const product2: Product = {
      id: 1,
      name: "computer",
      description: "-This lien 1/n -This is line2/n -This is line3/n",
    };

    products.push(product1);
    products.push(product2);

    const dataSource = new DataSource({
      store: products,
      paginate: false,
      requireTotalCount: true,
    });

    setDataSource(dataSource);
  }

  useEffect(() => {
    loadDataSource();
  }, []);

  return (
    <>
      <div className="list-container">
        <List
          dataSource={myDataSource}
          height="100%"
          itemRender={convertToHtmlTemplate}
        />
      </div>
    </>
  );
}
