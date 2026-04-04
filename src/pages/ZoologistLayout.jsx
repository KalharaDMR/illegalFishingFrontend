import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import "../zoologist/leafletSetup";
import "../zoologist/zoologist.css";

export default function ZoologistLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
