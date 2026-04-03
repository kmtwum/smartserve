import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing services
  await knex("services").del();

  // Insert sample home installation services
  await knex("services").insert([
    {
      name: "TV Mounting (30” to 75”)",
      description: "Professional wall-mounting for TVs between 30 and 75 inches. Includes bracket installation and cable concealment.",
      price: 200.0,
      duration_minutes: 60,
    },
    {
      name: "TV Mounting (75” to 100”)",
      description: "Heavy-duty wall-mounting for large-format TVs up to 100 inches. Includes bracket installation and cable concealment.",
      price: 250.0,
      duration_minutes: 90,
    },
    {
      name: "TV Setup (Non-Mount)",
      description: "Professional unboxing and setup of your TV on its included feet or stand. Includes initial configuration.",
      price: 100.0,
      duration_minutes: 30,
    },
    {
      name: "Projector & Screen Installation",
      description: "Complete installation and alignment of high-definition projectors and pull-down or fixed screens.",
      price: 250.0,
      duration_minutes: 120,
    },
    {
      name: "Hidden In-Wall Power Kit",
      description: "Installation of an in-wall power extension kit to hide unsightly power cables behind your TV.",
      price: 50.0,
      duration_minutes: 45,
    },
    {
      name: "In-Wall Speakers & Wire Concealment",
      description: "Professional installation of in-wall or in-ceiling speakers with hidden wire routing.",
      price: 50.0,
      duration_minutes: 60,
    },
    {
      name: "Sound System / Receiver Setup",
      description: "Unboxing, wiring, and calibration of home theater receivers and surround sound speaker systems.",
      price: 100.0,
      duration_minutes: 60,
    },
    {
      name: "Starlink Installation",
      description: "Professional mounting and setup of the Starlink satellite dish, including cable routing and router configuration.",
      price: 200.0,
      duration_minutes: 90,
    },
    {
      name: "Smart Doorbell Installation",
      description: "Installation and app setup for smart doorbells like Ring, Nest, or Arlo. Includes chime configuration.",
      price: 100.0,
      duration_minutes: 45,
    },
    {
      name: "Smart Door Lock Installation",
      description: "Replacement of existing deadbolts with smart locks. Includes app pairing and user code setup.",
      price: 150.0,
      duration_minutes: 45,
    },
    {
      name: "Smart Thermostat Installation",
      description: "Setup and wiring of smart thermostats like Nest or Ecobee. Includes app configuration and Wi-Fi setup.",
      price: 100.0,
      duration_minutes: 45,
    },
    {
      name: "Wired Security Camera Install",
      description: "Mounting and wiring of professional-grade security cameras (PoE or DC). Includes NVR/DVR setup.",
      price: 100.0,
      duration_minutes: 60,
    },
    {
      name: "Smart WiFi Camera Install",
      description: "Mounting and app configuration for wireless smart cameras. Includes motion detection setup.",
      price: 50.0,
      duration_minutes: 30,
    },
    {
      name: "Smart Floodlight Install",
      description: "Professional replacement or new installation of smart security floodlights with integrated cameras.",
      price: 200.0,
      duration_minutes: 60,
    },
    {
      name: "TV Stand Assembly",
      description: "Expert assembly of TV stands, entertainment centers, or media consoles. Includes placement.",
      price: 150.0,
      duration_minutes: 90,
    },
    {
      name: "Alarm System Installation",
      description: "Comprehensive installation of smart alarm systems, including base station, sensors, and keypad.",
      price: 300.0,
      duration_minutes: 120,
    },
    {
      name: "Smart Smoke Detector Install",
      description: "Installation and interconnectivity setup for smart smoke and carbon monoxide detectors.",
      price: 50.0,
      duration_minutes: 30,
    },
    {
      name: "Smart Light Switch Install",
      description: "Replacement of standard light switches with smart switches. Includes hub/app pairing.",
      price: 100.0,
      duration_minutes: 45,
    },
  ]);
}
