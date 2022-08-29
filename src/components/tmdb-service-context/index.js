import React from "react";

const { Provider: TmdbServiceProvider, Consumer: TmdbServiceConsumer } =
  React.createContext();

export { TmdbServiceProvider, TmdbServiceConsumer };
