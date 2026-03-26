import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing services
  await knex("services").del();

  // Insert sample home installation services
  await knex("services").insert([
    {
      name: "TV Mounting",
      description:
        "Professional wall-mounting for flat-screen TVs up to 75 inches. Includes bracket installation and cable concealment.",
      price: 149.99,
      duration_minutes: 60,
    },
    {
      name: "Smart Thermostat Installation",
      description:
        "Install and configure a smart thermostat (Nest, Ecobee, etc.). Includes wiring and app setup.",
      price: 99.99,
      duration_minutes: 60,
    },
    {
      name: "Dishwasher Installation",
      description:
        "Remove old unit and install a new dishwasher. Includes water line and drain hookup.",
      price: 199.99,
      duration_minutes: 120,
    },
    {
      name: "Ceiling Fan Installation",
      description:
        "Install a ceiling fan with light kit. Includes wiring and balancing.",
      price: 129.99,
      duration_minutes: 90,
    },
    {
      name: "Home Security Camera Setup",
      description:
        "Mount and configure up to 4 security cameras. Includes app setup and network configuration.",
      price: 249.99,
      duration_minutes: 120,
    },
    {
      name: "Smart Lock Installation",
      description:
        "Replace an existing deadbolt with a smart lock. Includes app pairing and key code setup.",
      price: 89.99,
      duration_minutes: 45,
    },
    {
      name: "Garbage Disposal Installation",
      description:
        "Remove old disposal and install a new unit. Includes electrical and plumbing connections.",
      price: 159.99,
      duration_minutes: 60,
    },
    {
      name: "Whole-Home Wi-Fi Setup",
      description:
        "Install and configure a mesh Wi-Fi system for full-home coverage. Includes speed optimization.",
      price: 179.99,
      duration_minutes: 90,
    },
  ]);
}
