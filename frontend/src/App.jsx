import Landing from "./pages/Landing";
import DemoWorkspace from "./pages/DemoWorkspace";

export default function App() {
  if (window.location.pathname === "/demo") {
    return <DemoWorkspace />;
  }
  return <Landing />;
}
