
import { useLoaderData } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Inventory = () => {
  const products = useLoaderData();

  return (
    <div className="inventory-page">
      <h2>Products ({products.length})</h2>

      <div className="product-grid">
        {products.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Inventory;
