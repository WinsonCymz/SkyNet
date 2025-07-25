// import flightsData from "../data/flights.json";

// export const fetchFlights = async () => {
//   return { data: flightsData };
// };

//NOT USING - BECAUSE THE ACCOUNT I SUB WITH HIT THE LIMIT

export async function getFlights() {
  const response = await fetch('http://localhost:4000/api/flights');
  return await response.json();
}