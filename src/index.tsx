import "@logseq/libs";
import { callSettings } from "./callSettings";
import { oohYeah } from "./oohYeah";
import { callStyle } from "./style";

import { Particles } from "./config/particles";
import { Fireworks } from "./config/fireworks";
import { Flames } from "./config/flames";
import { Magic } from "./config/magic";
import { Clippy } from "./config/clippy";
import { SimpleRift, ExplodingRift } from "./config/rift";

let combo = 0;

function getType(key: string): Object {
  let type = Clippy;
  switch (key) {
    case "Particles":
      type = Particles;
      break;
    case "Fireworks":
      type = Fireworks;
      break;
    case "Flames":
      type = Flames;
      break;
    case "Magic":
      type = Magic;
      break;
    case "Clippy":
      type = Clippy;
      break;
    case "SimpleRift":
      type = SimpleRift;
      break;
    case "ExplodingRift":
      type = ExplodingRift;
      break;
    default:
      type = Clippy;
  }
  return type;
}

const main = () => {
  console.log("logseq-power-plugin loaded");

  callStyle();
  callSettings();

  logseq.updateSettings({
    powerMode: false,
  });

  let cursorPosition: any = null;

  // let powerType = getType(logseq.settings.powerType);
  // const observer = new top.MutationObserver((mutations: MutationRecordType) => {
  //   oohYeah(powerType, cursorPosition, mutations);
  //   combo = combo + 1;
  //   top.document.getElementById("powerMode").classList.add("comboChange");
  //   top.document.getElementById("powerMode").innerHTML = combo.toString();
  // });
  let observer: MutationObserver;
  logseq.provideModel({
    trigger() {
      const { powerMode, powerType } = logseq.settings;

      if (!powerMode) {
        logseq.updateSettings({
          powerMode: true,
        });
        if (observer != null) {
          observer.disconnect();
        }
        // @ts-expect-error
        observer = new top.MutationObserver((mutations: MutationRecordType) => {
          oohYeah(getType(powerType), cursorPosition, mutations);
          combo = combo + 1;
          top.document.getElementById("powerMode").classList.add("comboChange");
          top.document.getElementById("powerMode").innerHTML = combo.toString();
        });

        logseq.UI.showMsg("Power mode turned ON", "success");
        top.document.getElementById("powerMode").innerHTML = `START TYPING`;

        observer.observe(
          top?.document.querySelector(".cp__sidebar-main-content"),
          {
            characterData: true,
            childList: true,
            subtree: true,
          }
        );
      } else {
        logseq.updateSettings({
          powerMode: false,
        });

        logseq.UI.showMsg("Power mode turned OFF", "success");

        observer.disconnect();

        top.document
          .getElementById("powerMode")
          .classList.remove("comboChange");
        top.document.getElementById("powerMode").classList.add("combo");
        top.document.getElementById("powerMode").innerHTML = `POWER MODE`;
      }
    },
  });

  logseq.App.registerUIItem("toolbar", {
    key: "logseq-powerMode-plugin",
    template: `<div class="combo" id="powerMode" data-on-click="trigger">POWER MODE</div>`,
  });
};

logseq.ready(main).catch(console.error);
