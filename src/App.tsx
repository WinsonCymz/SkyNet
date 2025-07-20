import "./App.css";
import Header from "./components/Header.tsx";
import SearchForm from "./components/SearchForm.tsx";
import background from "./assets/background.jpg";
import { Routes, Route } from "react-router-dom";
import SearchResults from "./pages/SeachResults.tsx";
import FlightDetails from "./pages/FlightDetails.tsx";
import PassengerInfo from "./pages/PassengerInfo.tsx";
import PaymentDetails from "./pages/Payments.tsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            className="App"
            style={{ backgroundImage: `url(${background})` }}
          >
            <Header />
            <div className="App-content">
              <h2>Millions of cheap flights. One simple search.</h2>
            </div>
            <div className="App-search-bar">
              <SearchForm />
            </div>
          </div>
        }
      />
      <Route path="/seachResults" element={<SearchResults />} />
      <Route path="/flight-details" element={<FlightDetails />} />
      <Route path="/passenger-info" element={<PassengerInfo />} />
      <Route path="/payment-details" element={<PaymentDetails />} />
    </Routes>
  );
}

export default App;
