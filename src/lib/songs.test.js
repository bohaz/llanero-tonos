import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SONGS,
  STORAGE_KEY,
  loadSongs,
  removeSong,
  saveSongs,
  songsInKey,
  upsertSong,
} from "./songs";

const songs = [
  { id: 1, title: "Llano adentro", artist: "Nelson Morales", tono: "DO" },
  { id: 2, title: "Laguna vieja", artist: "Reynaldo Armas", tono: "SOL" },
];

const memoryStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
};

describe("loadSongs", () => {
  it("returns the saved repertoire", () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(songs) });
    expect(loadSongs(storage)).toEqual(songs);
  });

  it("falls back to the default songs when nothing is saved", () => {
    expect(loadSongs(memoryStorage())).toBe(DEFAULT_SONGS);
  });

  it("falls back to the default songs when the data is corrupt", () => {
    expect(loadSongs(memoryStorage({ [STORAGE_KEY]: "{not json" }))).toBe(
      DEFAULT_SONGS,
    );
    expect(loadSongs(memoryStorage({ [STORAGE_KEY]: '{"a":1}' }))).toBe(
      DEFAULT_SONGS,
    );
  });

  it("works without storage", () => {
    expect(loadSongs(undefined)).toBe(DEFAULT_SONGS);
  });
});

describe("saveSongs", () => {
  it("does not throw when storage is full or blocked", () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new Error("QuotaExceededError");
      }),
    };
    expect(() => saveSongs(storage, songs)).not.toThrow();
  });
});

describe("upsertSong", () => {
  it("adds a new song with the given id and trimmed text", () => {
    const form = {
      title: "  A usted ",
      artist: " Reynaldo Armas ",
      tono: "MI",
    };
    const result = upsertSong(songs, form, { newId: 3 });

    expect(result).toHaveLength(3);
    expect(result[2]).toEqual({
      id: 3,
      title: "A usted",
      artist: "Reynaldo Armas",
      tono: "MI",
    });
  });

  it("updates the song being edited and leaves the rest alone", () => {
    const form = {
      title: "Llano adentro",
      artist: "Nelson Morales",
      tono: "RE",
    };
    const result = upsertSong(songs, form, { editingId: 1 });

    expect(result[0].tono).toBe("RE");
    expect(result[1]).toBe(songs[1]);
  });

  it("ignores a song without a title", () => {
    const form = { title: "   ", artist: "Alguien", tono: "DO" };
    expect(upsertSong(songs, form, { newId: 3 })).toBe(songs);
  });

  it("does not mutate the original list", () => {
    const copy = structuredClone(songs);
    upsertSong(songs, { title: "Nueva", artist: "", tono: "LA" }, { newId: 9 });
    expect(songs).toEqual(copy);
  });
});

describe("removeSong and songsInKey", () => {
  it("removes a song by id", () => {
    expect(removeSong(songs, 1)).toEqual([songs[1]]);
  });

  it("filters songs by key", () => {
    expect(songsInKey(songs, "SOL")).toEqual([songs[1]]);
    expect(songsInKey(songs, "SIm")).toEqual([]);
  });
});
