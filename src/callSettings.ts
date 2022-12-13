import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "powerType",
      type: "enum",
      enumPicker: "radio",
      enumChoices: ["Clippy", "Fireworks","Flames","Magic","Particles","SimpleRift","ExplodingRift"],
      default: "Clippy",
      description:
        "选择爆炸类型",
      title: "爆炸类型",
    }
  ];

  logseq.useSettingsSchema(settings);
};
