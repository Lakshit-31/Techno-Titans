import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/events" />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/create-event"
          element={<CreateEvent />}
        />

        <Route
          path="/edit-event/:id"
          element={<EditEvent />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;