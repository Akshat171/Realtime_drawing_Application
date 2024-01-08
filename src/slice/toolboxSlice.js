import { createSlice } from "@reduxjs/toolkit";
import { MENU_ITEMS, COLORS } from "@/components/constents";

//initial states
const initialState = {
  //when we click on pencil it will be initially in black color and size is 3.
  [MENU_ITEMS.PENCIL]: {
    color: COLORS.BLACK,
    size: 3,
  },
  [MENU_ITEMS.ERASER]: {
    color: COLORS.WHITE,
    size: 3,
  },
  //nothing happening initially
  [MENU_ITEMS.UNDO]: {},
  [MENU_ITEMS.REDO]: {},
  [MENU_ITEMS.DOWNLOAD]: {},
};

//features
//actions needs to be mention that needs to be done through this reducer
export const toolboxSlice = createSlice({
  name: "toolbox", // A name used to identify the reducer, must be unique.
  initialState,
  reducers: {
    changeColor: (state, action) => {
      state[action.payload.item].color = action.payload.color;
    },
    changeBrushSize: (state, action) => {
      state[action.payload.item].size = action.payload.size;
    },
  },
});

export const { changeBrushSize, changeColor } = toolboxSlice.actions;

export default toolboxSlice.reducer;
