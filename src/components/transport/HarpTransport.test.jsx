import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HarpTransport from "./HarpTransport";

describe("HarpTransport", () => {
  it("shows the string to adjust for the selected keys", async () => {
    const user = userEvent.setup();
    render(<HarpTransport />);

    await user.selectOptions(screen.getByLabelText("Tono actual"), "DO");
    await user.selectOptions(screen.getByLabelText("Transportar a"), "SOL");
    await user.click(
      screen.getByRole("button", { name: "Calcular transporte" }),
    );

    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps).toHaveLength(1);
    expect(steps[0]).toHaveTextContent("Cuerda FA");
    expect(steps[0]).toHaveTextContent("→ FA#");
    expect(steps[0]).toHaveTextContent("Subir ½ tono");
  });

  it("explains when there is nothing to change", async () => {
    const user = userEvent.setup();
    render(<HarpTransport />);

    await user.selectOptions(screen.getByLabelText("Transportar a"), "RE");
    await user.click(
      screen.getByRole("button", { name: "Calcular transporte" }),
    );

    expect(
      screen.getByText(/no hay que mover ninguna cuerda/),
    ).toBeInTheDocument();
  });
});
