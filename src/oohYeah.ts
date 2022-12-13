import { explode,explodex } from "./utils/kaboom";
import { CursorExploder } from './Cursor-exploder';

export const oohYeah = async (powerType:any,
  cursorPosition: any,
  mutations: any
) => {
  for (const mutation of mutations) {
    if (mutation.type === "characterData") {

      // exploding curosr
      let newCursorPosition = await logseq.Editor.getEditingCursorPosition();

      if (newCursorPosition === null) {
        cursorPosition = cursorPosition;
      } else {
        cursorPosition = newCursorPosition;
      }

      if (cursorPosition) {
        explodex(
          cursorPosition.rect.left + cursorPosition.left,
          cursorPosition.rect.top + cursorPosition.top,new CursorExploder(powerType)
        );
      }

      // // shake shake
      // logseq.provideStyle(`
      //                   .cp__sidebar-main-content {
      //                   animation: shake 1s !important;
      //                   animation-iteration-count: 1 !important;
      //                   }
      //                   `);
      // window.setTimeout(() => {
      //   logseq.provideStyle(`
      //                   .cp__sidebar-main-content {
      //                   animation: null !important;
      //                   animation-iteration-count: null !important;
      //                   }
      //                   `);
      // }, 100);
    }
  }
};

