import seedCars from "./carsData.json";

export const CARS_STORAGE_KEY = "carsData";

export const getSeedCars = () => seedCars;

export const getCars = () => {
  try {
    const storedCars = JSON.parse(localStorage.getItem(CARS_STORAGE_KEY) || "[]");

    if (!Array.isArray(storedCars) || storedCars.length === 0) {
      return getSeedCars();
    }

    const baseIds = new Set(getSeedCars().map((car) => car.id));
    const hasBaseCars = storedCars.some((car) => baseIds.has(car.id));
    return hasBaseCars ? storedCars : [...getSeedCars(), ...storedCars];
  } catch (error) {
    return getSeedCars();
  }
};

export const saveCars = (cars) => {
  localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
};
