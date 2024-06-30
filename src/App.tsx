import "./App.css";
import SvgLoader from "./canvas";
import Sidebar from "./sidebar/sidebar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <SvgLoader />
    </div>
  );
}

export default App;
