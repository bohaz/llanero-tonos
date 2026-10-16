import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { STORAGE_KEY } from "@/lib/songs";
import LlaneroTonosApp from "./LlaneroTonosApp";

const renderApp = () => {
  const user = userEvent.setup();
  render(<LlaneroTonosApp />);
  return user;
};

describe("repertoire", () => {
  it("adds a song under its key and saves it", async () => {
    const user = renderApp();

    await user.type(screen.getByLabelText("Canción"), "Pajarillo");
    await user.type(screen.getByLabelText("Intérprete"), "Tradicional");
    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByText("Pajarillo")).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.some((song) => song.title === "Pajarillo")).toBe(true);
  });

  it("edits a song and moves it to another key", async () => {
    const user = renderApp();

    const [editButton] = screen.getAllByRole("button", { name: "Editar" });
    await user.click(editButton);

    expect(screen.getByLabelText("Canción")).toHaveValue("Llano adentro");

    await user.selectOptions(screen.getByLabelText("Tono"), "RE");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.queryByText("Llano adentro")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "RE" }));
    expect(screen.getByText("Llano adentro")).toBeInTheDocument();
  });

  it("deletes a song", async () => {
    const user = renderApp();

    const [deleteButton] = screen.getAllByRole("button", { name: "Borrar" });
    await user.click(deleteButton);

    expect(screen.queryByText("Llano adentro")).not.toBeInTheDocument();
  });
});
