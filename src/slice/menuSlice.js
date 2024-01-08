// import { createSlice } from "@reduxjs/toolkit";
// //A collection of redux reducer logic and actions for single feature
// // in your app, typically defined together in a single file
// //whatever action will be perform by by menu items will be stored in menu slice

// import { MENU_ITEMS } from "@/components/constents";

// //Menu slice initial state
// const initialState = {
//   activeMenuItem: MENU_ITEMS.PENCIL, //by default
//   actionMenuItem: null,
// };

// //features/slices
// //methods or actions that needs to be done through this reducer
// export const menuSlice = createSlice({
//   name: "menu", // A name used to identify the reducer, must be unique.
//   initialState,
//   reducers: {
//     menuItemClick: (state, action) => {
//       state.activeMenuItem = action.payload;
//     },
//     actionItemClick: (state, action) => {
//       state.activeMenuItem = action.payload;
//     },
//   },
// });

// //export each reducer separately
// export const { menuItemClick, actionItemClick } = menuSlice.actions;

// export default menuSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS } from "@/components/constents";

const initialState = {
  activeMenuItem: MENU_ITEMS.PENCIL,
  actionMenuItem: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    menuItemClick: (state, action) => {
      state.activeMenuItem = action.payload;
    },
    actionItemClick: (state, action) => {
      state.actionMenuItem = action.payload;
    },
  },
});

export const { menuItemClick, actionItemClick } = menuSlice.actions;

export default menuSlice.reducer;
