import { useRef, useEffect } from "react";
import Layout from "../../Layout";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetLatestProductsQuery,
  useGetCategoriesTreeQuery,
} from "../../redux/queries/productApi";
import Product from "../../components/Product";
import ProductCategorySection from "../../components/ProductCategorySection";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import FeaturedProducts from "../../components/FeaturedProducts";
import { CollectionStrip } from "../../components/CollectionStripe";
import { MaterialsSection } from "../../components/MaterialSection";
import { HeroSection } from "../../components/HeroSection";

import X from "../../components/X";
import Y from "../../components/Y";
import HeroSection2 from "../../components/HeroSection2";
import HeroSection3 from "../../components/HeroSection3";
import HeroSection5 from "../../components/HeroSection5";
import HeroSection6 from "../../components/HeroSection6";
import HeroSection7 from "../../components/HeroSection7";
import HeroSection8 from "../../components/HeroSection8";
import Test from "../../components/Test.jsx";
import Test2 from "../../components/Test2.jsx";
import Test3 from "../../components/Test3.jsx";
import Luxery from "../../components/Luxery.jsx";
import SmoothScroll from "../../components/SmoothScroll";
import { HeritageSection } from "../../components/Heritage.jsx";
import Hussain from "../../components/Hussain.jsx";
import Fahad from "../../components/Fahad.jsx";

function Home() {
  const { data: products, isLoading, refetch } = useGetLatestProductsQuery();

  const prevStockRef = useRef([]);
  useEffect(() => {
    if (products) {
      const currentStock = products.map((p) => p.countInStock);
      const prevStock = prevStockRef.current;
      const stockChanged = currentStock.some((stock, index) => stock !== prevStock[index]);
      if (stockChanged) refetch();
      prevStockRef.current = currentStock;
    }
  }, [products, refetch]);

  return (
    <Layout>
      <SmoothScroll>
        {/* <Hussain /> */}
        {/* <Fahad /> */}
        <Luxery />
        {/* <Test3 /> */}
        {/* <Test /> */}
        {/* <Test2 /> */}
        {/* <HeroSection /> */}
        {/* <HeroSection2 /> */}
        {/* <HeroSection3 /> */}
        {/* <HeroSection5 /> */}
        {/* <HeroSection6 /> */}
        {/* <HeroSection7 /> */}
        {/* <HeroSection8 /> */}
        <FeaturedProducts products={products} isLoading={isLoading} />
        <CollectionStrip />
        <HeritageSection />
      </SmoothScroll>
      {/* <MaterialsSection /> */}
      {/* <X /> */}
      {/* <Y /> */}
    </Layout>
  );
}

export default Home;
